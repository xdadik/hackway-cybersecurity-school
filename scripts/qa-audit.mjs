/**
 * Frontend QA sweep: renders every page at three breakpoints, records console
 * errors, failed requests and layout overflow, and writes screenshots.
 *
 * Run with: node scripts/qa-audit.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "qa-screenshots");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const PAGES = [
  { name: "home", url: "/" },
  { name: "courses", url: "/courses" },
  { name: "course-detail", url: "/courses/web-application-security" },
  { name: "lesson", url: "/learn/web-application-security/les-web-1-1" },
  { name: "signin", url: "/signin" },
  { name: "register", url: "/register" },
  { name: "privacy", url: "/privacy" },
];

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const report = [];

for (const viewport of VIEWPORTS) {
  for (const target of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
    });

    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text().slice(0, 300));
    });
    page.on("pageerror", (error) => pageErrors.push(String(error).slice(0, 300)));
    page.on("requestfailed", (request) => {
      failedRequests.push(
        `${request.method()} ${request.url().replace(BASE, "")} :: ${request.failure()?.errorText}`
      );
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        failedRequests.push(
          `${response.status()} ${response.url().replace(BASE, "")}`
        );
      }
    });

    try {
      await page.goto(`${BASE}${target.url}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
    } catch (error) {
      pageErrors.push(`navigation: ${String(error).slice(0, 200)}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const offenders = [];
      if (overflow > 1) {
        for (const element of document.querySelectorAll("body *")) {
          const rect = element.getBoundingClientRect();
          if (rect.right > doc.clientWidth + 1 || rect.left < -1) {
            offenders.push(
              `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 60)} right=${Math.round(rect.right)}`
            );
            if (offenders.length > 5) break;
          }
        }
      }
      return {
        overflow,
        offenders,
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() ?? null,
        bodyBg: getComputedStyle(document.body).backgroundColor,
        bodyColor: getComputedStyle(document.body).color,
      };
    });

    const file = path.join(OUT, `${target.name}-${viewport.name}.png`);
    await page.screenshot({ path: file, fullPage: false });

    report.push({
      page: target.name,
      viewport: viewport.name,
      title: metrics.title,
      h1: metrics.h1,
      overflow: metrics.overflow,
      offenders: metrics.offenders,
      consoleErrors: [...new Set(consoleErrors)],
      pageErrors: [...new Set(pageErrors)],
      failedRequests: [...new Set(failedRequests)],
    });

    await page.close();
  }
}

await browser.close();

let hasIssues = false;
for (const entry of report) {
  const issues = [];
  if (entry.overflow > 1) issues.push(`OVERFLOW ${entry.overflow}px ${JSON.stringify(entry.offenders)}`);
  if (entry.consoleErrors.length) issues.push(`CONSOLE ${JSON.stringify(entry.consoleErrors)}`);
  if (entry.pageErrors.length) issues.push(`PAGEERROR ${JSON.stringify(entry.pageErrors)}`);
  if (entry.failedRequests.length) issues.push(`REQ ${JSON.stringify(entry.failedRequests)}`);

  if (issues.length) hasIssues = true;
  console.log(
    `${issues.length ? "FAIL" : "ok  "} ${entry.page.padEnd(14)} ${entry.viewport.padEnd(8)} h1="${(entry.h1 ?? "").slice(0, 42)}" bg=${entry.bodyBg} ${issues.join(" | ")}`
  );
}

console.log(`\nScreenshots written to ${OUT}`);
process.exit(hasIssues ? 1 : 0);
