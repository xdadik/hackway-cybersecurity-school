import puppeteer from "puppeteer";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const problems = [];
const IGNORE =
  /Download the React DevTools|Fast Refresh|_rsc=|ERR_ABORTED|Prefetch/i;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

let jar = []; // cookie storage shared across pages

function record(label, kind, text, { expectedStatus } = {}) {
  if (IGNORE.test(text)) return;
  if (expectedStatus && kind === `http.${expectedStatus}`) return;
  problems.push({ label, kind, text });
}

function attach(page, label, { expect404 = false } = {}) {
  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    record(label, `console.${msg.type()}`, msg.text(), {
      expectedStatus: expect404 ? 404 : undefined,
    });
  });
  page.on("pageerror", (err) =>
    record(label, "pageerror", String(err?.message ?? err))
  );
  page.on("requestfailed", (req) =>
    record(label, "requestfailed", `${req.method()} ${req.url()} — ${req.failure()?.errorText}`)
  );
  page.on("response", (res) => {
    if (res.status() < 400) return;
    record(label, `http.${res.status()}`, `${res.request().method()} ${res.url()}`, {
      expectedStatus: expect404 ? 404 : undefined,
    });
  });
}

async function visit(route, { expect404 = false, width = 1280, height = 900 } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  if (jar.length) await page.setCookie(...jar);
  attach(page, route, { expect404 });
  const res = await page
    .goto(BASE + route, { waitUntil: "networkidle2" })
    .catch((err) => {
      record(route, "nav-failed", String(err.message));
      return null;
    });
  await new Promise((r) => setTimeout(r, 300));
  jar = await page.cookies();
  const bodyText = await page.evaluate(() => document.body.innerText.trim().length);
  if (bodyText < 120) record(route, "blank-page", `body text ${bodyText} chars`);
  return { page, status: res?.status(), bodyText };
}

// ---------------- anonymous sweep ----------------
for (const route of ["/", "/courses", "/signin", "/register", "/privacy", "/terms"]) {
  const { page } = await visit(route);
  await page.close();
}

await visit("/does-not-exist", { expect404: true }).then(({ page }) => page.close());

// ---------------- register ----------------
const email = `frontend.check.${Date.now()}@example.com`;
{
  const { page } = await visit("/register");
  await page.type('input[name="name"]', "Frontend Check");
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', "Sup3rSecret!23");
  await page.type('input[name="confirmPassword"]', "Sup3rSecret!23");
  await page.click('button[type="submit"]');
  await page
    .waitForFunction(() => location.pathname !== "/register", { timeout: 20000 })
    .catch(() =>
      record("register-submit", "stuck", "still on /register after submit")
    );
  await new Promise((r) => setTimeout(r, 900));
  var afterRegister = new URL(page.url()).pathname;
  if (afterRegister === "/register") {
    const formError = await page.evaluate(
      () => document.querySelector('[role="alert"]')?.textContent ?? null
    );
    record("register-submit", "form-error", String(formError));
  }
  jar = await page.cookies();
  await page.close();
}

// ---------------- course catalogue ----------------
let uniqueCourses = [];
{
  const { page } = await visit("/courses");
  uniqueCourses = [
    ...new Set(
      await page.$$eval('a[href^="/courses/"]', (els) =>
        els.map((e) => e.getAttribute("href"))
      )
    ),
  ];
  if (uniqueCourses.length === 0)
    record("/courses", "no-course-links", "rendered zero course links");
  await page.close();
}

// ---------------- course detail + enroll ----------------
let enrollClicked = null;
const courseRoute = uniqueCourses[0];
if (courseRoute) {
  const { page } = await visit(courseRoute);
  enrollClicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      /enrol|enroll|start course|start learning/i.test(b.innerText)
    );
    if (!btn) return null;
    btn.click();
    return btn.innerText.trim();
  });
  if (!enrollClicked) record(courseRoute, "no-enroll-cta", "no enroll button found");
  await new Promise((r) => setTimeout(r, 2000));
  const toast = await page.evaluate(() => {
    const el = document.querySelector('[data-toast], [role="status"]');
    return el?.textContent ?? null;
  });
  if (toast && /could not|cannot|error|not configured/i.test(toast))
    record(courseRoute, "enroll-failed", toast);
  jar = await page.cookies();
  await page.close();
}

// ---------------- my learning ----------------
let myLearningCourses = [];
{
  const { page } = await visit("/my-learning");
  myLearningCourses = await page.$$eval('a[href^="/learn/"]', (els) =>
    els.map((e) => e.getAttribute("href"))
  );
  if (myLearningCourses.length === 0)
    record("/my-learning", "no-lesson-links", "no /learn links after enrolling");
  await page.close();
}

// ---------------- lesson page ----------------
if (myLearningCourses[0]) {
  const route = myLearningCourses[0];
  const { page } = await visit(route);
  await new Promise((r) => setTimeout(r, 800));
  const video = await page.evaluate(() => {
    const v = document.querySelector("video");
    if (!v) return { present: false };
    return {
      present: true,
      readyState: v.readyState,
      networkState: v.networkState,
      src: v.currentSrc || v.getAttribute("src"),
      error: v.error ? `${v.error.code}:${v.error.message}` : null,
    };
  });
  if (!video.present) record(route, "no-video-element", "lesson has no <video>");
  else if (video.error) record(route, "video-error", JSON.stringify(video));
  else if (video.readyState === 0)
    record(route, "video-not-loaded", JSON.stringify(video));

  const complete = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      /mark.*(complete|done)|complete lesson/i.test(b.innerText)
    );
    if (!btn) return null;
    btn.click();
    return btn.innerText.trim();
  });
  if (!complete) record(route, "no-complete-control", "no mark-complete button");
  await new Promise((r) => setTimeout(r, 1500));
  await page.close();
}

// ---------------- profile ----------------
{
  const { page, bodyText } = await visit("/profile");
  var profileText = bodyText;
  await page.close();
}

// ---------------- mobile layout ----------------
for (const route of ["/", "/courses", "/my-learning"]) {
  const { page } = await visit(route, { width: 390, height: 844 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 2) record(route, "h-overflow", `${overflow}px at 390px wide`);
  await page.close();
}

await browser.close();

const counts = {};
for (const p of problems) counts[p.kind] = (counts[p.kind] ?? 0) + 1;

console.log(
  JSON.stringify(
    { afterRegister, uniqueCourses, enrollClicked, myLearningCourses, profileText, counts, problems },
    null,
    2
  )
);
