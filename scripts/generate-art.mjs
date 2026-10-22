/**
 * Generates the Hackway Academy course artwork as scalable SVG files.
 *
 * The illustrations share one visual language: black surfaces, a fine
 * technical grid, restrained lime line work and a single soft accent glow.
 * Run with: npm run generate:art
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public", "art");
fs.mkdirSync(outDir, { recursive: true });

const palette = {
  bgA: "#0C1320",
  bgB: "#101827",
  bgC: "#080D16",
  cyan: "#38BDF8",
  blue: "#6595FF",
  lavender: "#A78BFA",
  grid: "#22304A",
  line: "#2C3C55",
  text: "#A6B2C3",
  muted: "#6E7C92",
};

function defs(id, accent) {
  return `
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.bgA}"/>
      <stop offset="0.55" stop-color="${palette.bgB}"/>
      <stop offset="1" stop-color="${palette.bgC}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.74" cy="0.18" r="0.7">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="${accent}" stop-opacity="0.05"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid-${id}" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="${palette.grid}" stroke-opacity="0.32" stroke-width="1"/>
    </pattern>
    <linearGradient id="stroke-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${palette.blue}" stop-opacity="0.25"/>
    </linearGradient>
  </defs>`;
}

function frame(id, accent, title, category, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${title} artwork">
  ${defs(id, accent)}
  <rect width="1280" height="720" fill="url(#bg-${id})"/>
  <rect width="1280" height="720" fill="url(#grid-${id})"/>
  <rect width="1280" height="720" fill="url(#glow-${id})"/>
  ${body}
  <g font-family="Inter, 'Segoe UI', sans-serif">
    <g transform="translate(64 560)">
      <path d="M0 0h22v22H0z" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.5"/>
      <path d="M6 11l4 4 7-8" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="36" y="16" fill="${palette.text}" font-size="17" letter-spacing="2.4" font-weight="600">HACKWAY</text>
    </g>
    <text x="1216" y="576" text-anchor="end" fill="${palette.muted}" font-size="14" letter-spacing="3" font-family="ui-monospace, 'Cascadia Code', monospace">${category.toUpperCase()}</text>
  </g>
</svg>`;
}

const artworks = {
  "course-cybersecurity-fundamentals": () => {
    const id = "fund";
    const accent = palette.cyan;
    let rings = "";
    for (let i = 0; i < 5; i += 1) {
      const r = 120 + i * 62;
      rings += `<circle cx="880" cy="330" r="${r}" fill="none" stroke="${accent}" stroke-opacity="${(0.4 - i * 0.06).toFixed(2)}" stroke-width="1.4"/>`;
    }
    let hex = "";
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const x = 140 + col * 92 + (row % 2 === 1 ? 46 : 0);
        const y = 170 + row * 80;
        hex += `<path d="M${x} ${y - 26}l22 13v26l-22 13-22-13v-26z" fill="none" stroke="${palette.line}" stroke-opacity="0.75" stroke-width="1.2"/>`;
      }
    }
    const body = `
  <g opacity="0.85">${hex}</g>
  ${rings}
  <g transform="translate(880 330)">
    <path d="M0 -74l58 30v52c0 40-24 66-58 84-34-18-58-44-58-84v-52z" fill="${accent}" fill-opacity="0.07" stroke="url(#stroke-${id})" stroke-width="2"/>
    <path d="M-24 8l16 18 34-42" fill="none" stroke="${accent}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path d="M120 470h380" stroke="${palette.line}" stroke-width="1"/>
  <circle cx="120" cy="470" r="4" fill="${accent}" fill-opacity="0.8"/>
  <circle cx="500" cy="470" r="4" fill="${palette.blue}" fill-opacity="0.5"/>`;
    return frame(
      id,
      accent,
      "Cybersecurity Fundamentals",
      "Foundations",
      body
    );
  },

  "course-computer-networking-for-security": () => {
    const id = "net";
    const accent = palette.cyan;
    const nodes = [
      [820, 180],
      [980, 250],
      [900, 360],
      [1060, 400],
      [760, 300],
      [700, 430],
      [1010, 520],
      [880, 520],
      [1140, 260],
    ];
    const links = [
      [0, 4],
      [4, 5],
      [0, 1],
      [1, 8],
      [1, 2],
      [2, 3],
      [3, 6],
      [2, 7],
      [4, 2],
      [6, 7],
      [5, 7],
    ];
    let linkPaths = links
      .map(
        ([a, b]) =>
          `<path d="M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}" stroke="${accent}" stroke-opacity="0.32" stroke-width="1.4"/>`
      )
      .join("\n  ");
    let nodeCircles = nodes
      .map(
        (n, i) =>
          `<circle cx="${n[0]}" cy="${n[1]}" r="${i % 3 === 0 ? 9 : 6}" fill="${palette.bgC}" stroke="${i % 3 === 0 ? accent : palette.blue}" stroke-opacity="${i % 3 === 0 ? 0.95 : 0.55}" stroke-width="1.8"/>`
      )
      .join("\n  ");
    const body = `
  <g stroke-linecap="round">${linkPaths}</g>
  ${nodeCircles}
  <g transform="translate(300 250)" opacity="0.92">
    <rect x="0" y="0" width="380" height="230" rx="14" fill="${palette.bgC}" fill-opacity="0.5" stroke="${palette.line}" stroke-width="1.2"/>
    <rect x="0" y="0" width="380" height="42" rx="14" fill="${palette.bgA}" fill-opacity="0.8"/>
    <circle cx="26" cy="21" r="5" fill="${palette.line}"/>
    <circle cx="44" cy="21" r="5" fill="${palette.line}"/>
    <rect x="72" y="12" width="210" height="18" rx="9" fill="${palette.bgC}" stroke="${palette.line}" stroke-width="1"/>
    <text x="86" y="25" fill="${palette.muted}" font-size="12" font-family="ui-monospace, monospace">192.168.10.24/24</text>
    <rect x="26" y="66" width="150" height="10" rx="5" fill="${palette.line}" fill-opacity="0.7"/>
    <rect x="26" y="86" width="240" height="10" rx="5" fill="${palette.line}" fill-opacity="0.45"/>
    <rect x="26" y="106" width="196" height="10" rx="5" fill="${accent}" fill-opacity="0.45"/>
    <rect x="26" y="134" width="120" height="62" rx="8" fill="${palette.bgA}" stroke="${palette.line}" stroke-width="1"/>
    <path d="M26 186l30-30 26 22 24-38" fill="none" stroke="${accent}" stroke-width="1.8" stroke-opacity="0.8"/>
  </g>
  <path d="M150 250h90" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.4" stroke-dasharray="5 6"/>
  <text x="150" y="234" fill="${palette.muted}" font-size="13" font-family="ui-monospace, monospace" letter-spacing="1.6">ENCRYPTED</text>`;
    return frame(
      id,
      accent,
      "Computer Networking for Security",
      "Networking",
      body
    );
  },

  "course-linux-essentials-for-cybersecurity": () => {
    const id = "lin";
    const accent = palette.cyan;
    const tree = `
  <g transform="translate(90 150)">
    <g stroke="${palette.line}" stroke-width="1.2" fill="none">
      <path d="M20 40v300M20 120h120M20 200h120M20 280h120M20 360h120"/>
      <path d="M140 120v40M140 200v40M140 280v40M140 360v40"/>
    </g>
    <g>
      <rect x="0" y="20" width="40" height="40" rx="8" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.7" stroke-width="1.4"/>
      <path d="M10 34h20M10 44h14" stroke="${accent}" stroke-opacity="0.85" stroke-width="1.6" stroke-linecap="round"/>
      <text x="56" y="46" fill="${palette.text}" font-size="15" font-family="ui-monospace, monospace">/var</text>

      <rect x="140" y="102" width="34" height="34" rx="7" fill="${palette.bgC}" stroke="${palette.line}" stroke-width="1.2"/>
      <text x="186" y="124" fill="${palette.text}" font-size="14" font-family="ui-monospace, monospace">/etc</text>
      <rect x="140" y="182" width="34" height="34" rx="7" fill="${palette.bgC}" stroke="${palette.line}" stroke-width="1.2"/>
      <text x="186" y="204" fill="${palette.text}" font-size="14" font-family="ui-monospace, monospace">/home</text>
      <rect x="140" y="262" width="34" height="34" rx="7" fill="${palette.bgC}" stroke="${palette.line}" stroke-width="1.2"/>
      <text x="186" y="284" fill="${palette.text}" font-size="14" font-family="ui-monospace, monospace">/var/log</text>
      <rect x="140" y="342" width="34" height="34" rx="7" fill="${palette.bgC}" stroke="${palette.line}" stroke-width="1.2"/>
      <text x="186" y="364" fill="${palette.text}" font-size="14" font-family="ui-monospace, monospace">/opt</text>
    </g>
    <g fill="${palette.muted}" font-family="ui-monospace, monospace" font-size="13">
      <text x="330" y="124">passwd</text>
      <text x="330" y="204">student</text>
      <text x="330" y="284">auth.log</text>
      <text x="330" y="284" opacity="0.6">syslog</text>
      <text x="330" y="364">tools</text>
    </g>
    <g stroke="${palette.line}" stroke-width="1">
      <path d="M320 118h190M320 198h190M320 278h190M320 358h190"/>
    </g>
  </g>
  <g transform="translate(880 170)">
    <rect x="0" y="0" width="300" height="150" rx="14" fill="${palette.bgC}" fill-opacity="0.55" stroke="${palette.line}" stroke-width="1.2"/>
    <text x="28" y="46" fill="${palette.muted}" font-size="13" letter-spacing="2.4" font-family="ui-monospace, monospace">PERMISSIONS</text>
    <text x="28" y="94" fill="${palette.text}" font-size="34" font-family="ui-monospace, monospace">-rwxr-x---</text>
    <rect x="28" y="112" width="244" height="8" rx="4" fill="${palette.line}" fill-opacity="0.8"/>
    <rect x="28" y="112" width="168" height="8" rx="4" fill="${accent}" fill-opacity="0.55"/>
  </g>`;
    const body = `${tree}`;
    return frame(
      id,
      accent,
      "Linux Essentials for Cybersecurity",
      "Linux",
      body
    );
  },

  "course-web-application-security": () => {
    const id = "web";
    const accent = palette.blue;
    const body = `
  <g transform="translate(120 150)">
    <rect x="0" y="0" width="520" height="300" rx="16" fill="${palette.bgC}" fill-opacity="0.55" stroke="${palette.line}" stroke-width="1.2"/>
    <path d="M0 44h520" stroke="${palette.line}" stroke-width="1.2"/>
    <circle cx="30" cy="22" r="6" fill="${palette.line}"/>
    <circle cx="52" cy="22" r="6" fill="${palette.line}"/>
    <circle cx="74" cy="22" r="6" fill="${palette.line}"/>
    <rect x="104" y="12" width="330" height="20" rx="10" fill="${palette.bgA}" stroke="${palette.line}" stroke-width="1"/>
    <text x="118" y="26" fill="${palette.muted}" font-size="12" font-family="ui-monospace, monospace">https://app.example.org/login</text>
    <g stroke="${palette.line}" stroke-width="1" fill="none">
      <rect x="36" y="86" width="200" height="12" rx="6"/>
      <rect x="36" y="118" width="320" height="12" rx="6" fill-opacity="0.5"/>
      <rect x="36" y="150" width="260" height="12" rx="6" fill-opacity="0.35"/>
      <rect x="36" y="196" width="120" height="40" rx="8" fill-opacity="0.6"/>
    </g>
    <text x="36" y="264" fill="${palette.muted}" font-size="13" font-family="ui-monospace, monospace">POST /session</text>
  </g>
  <g transform="translate(700 150)">
    <rect x="0" y="60" width="380" height="180" rx="16" fill="${palette.bgC}" fill-opacity="0.5" stroke="${palette.line}" stroke-width="1.2"/>
    <g stroke="${palette.line}" stroke-width="1.2" fill="none">
      <rect x="40" y="96" width="300" height="108" rx="10"/>
      <path d="M40 128h300M40 168h300" stroke-opacity="0.6"/>
    </g>
    <text x="56" y="118" fill="${palette.muted}" font-size="12" font-family="ui-monospace, monospace">server</text>
    <g stroke="${accent}" stroke-width="2" fill="none" stroke-linecap="round">
      <path d="M540 210h120" stroke-dasharray="2 8"/>
      <path d="M660 210l-14-9v18z" fill="${accent}" stroke="none"/>
      <path d="M660 300H540" stroke-dasharray="2 8"/>
      <path d="M540 300l14-9v18z" fill="${accent}" stroke="none"/>
    </g>
    <text x="556" y="196" fill="${accent}" fill-opacity="0.85" font-size="12" letter-spacing="2" font-family="ui-monospace, monospace">REQUEST</text>
    <text x="556" y="330" fill="${accent}" fill-opacity="0.85" font-size="12" letter-spacing="2" font-family="ui-monospace, monospace">RESPONSE</text>
  </g>`;
    return frame(
      id,
      accent,
      "Web Application Security",
      "Application Security",
      body
    );
  },

  "course-introduction-to-penetration-testing": () => {
    const id = "pen";
    const accent = palette.blue;
    const body = `
  <g transform="translate(860 340)">
    <circle r="250" fill="none" stroke="${palette.line}" stroke-opacity="0.55" stroke-width="1"/>
    <circle r="196" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="14 12"/>
    <circle r="132" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="1.2"/>
    <circle r="66" fill="${accent}" fill-opacity="0.06" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.4"/>
    <g stroke="${palette.muted}" stroke-opacity="0.5" stroke-width="1">
      <path d="M-290 0h580M0 -290v580"/>
    </g>
    <circle cx="132" cy="-132" r="7" fill="${palette.cyan}"/>
    <circle cx="-160" cy="90" r="5" fill="${palette.blue}" fill-opacity="0.7"/>
    <circle cx="60" cy="168" r="5" fill="${palette.lavender}" fill-opacity="0.6"/>
    <path d="M132 -132L0 0" stroke="${palette.cyan}" stroke-opacity="0.45" stroke-width="1.2" stroke-dasharray="5 7"/>
  </g>
  <g transform="translate(120 180)">
    <rect x="0" y="0" width="380" height="46" rx="10" fill="${palette.bgC}" fill-opacity="0.6" stroke="${palette.line}" stroke-width="1.2"/>
    <text x="24" y="29" fill="${palette.muted}" font-size="13" letter-spacing="2.2" font-family="ui-monospace, monospace">SCOPE</text>
    <rect x="120" y="14" width="236" height="18" rx="9" fill="${accent}" fill-opacity="0.25"/>
  </g>
  <g transform="translate(120 268)">
    <rect x="0" y="0" width="380" height="46" rx="10" fill="${palette.bgC}" fill-opacity="0.6" stroke="${palette.line}" stroke-width="1.2"/>
    <text x="24" y="29" fill="${palette.muted}" font-size="13" letter-spacing="2.2" font-family="ui-monospace, monospace">RULES OF ENGAGEMENT</text>
    <rect x="230" y="14" width="126" height="18" rx="9" fill="${palette.cyan}" fill-opacity="0.22"/>
  </g>
  <g transform="translate(120 356)">
    <rect x="0" y="0" width="380" height="46" rx="10" fill="${palette.bgC}" fill-opacity="0.6" stroke="${palette.line}" stroke-width="1.2"/>
    <text x="24" y="29" fill="${palette.muted}" font-size="13" letter-spacing="2.2" font-family="ui-monospace, monospace">EVIDENCE LOG</text>
    <rect x="196" y="14" width="160" height="18" rx="9" fill="${palette.lavender}" fill-opacity="0.2"/>
  </g>`;
    return frame(
      id,
      accent,
      "Introduction to Penetration Testing",
      "Offensive Security",
      body
    );
  },

  "course-security-operations-fundamentals": () => {
    const id = "soc";
    const accent = palette.cyan;
    const bars = [40, 72, 54, 96, 64, 118, 86, 140, 104, 158, 122, 176];
    let barRects = bars
      .map((h, i) => {
        const x = 160 + i * 46;
        return `<rect x="${x}" y="${500 - h}" width="22" height="${h}" rx="4" fill="${
          i % 4 === 3 ? accent : palette.line
        }" fill-opacity="${i % 4 === 3 ? 0.65 : 0.75}"/>`;
      })
      .join("\n  ");
    let ticks = bars
      .map((_, i) => {
        const x = 160 + i * 46 + 11;
        return `<circle cx="${x}" cy="500" r="2.6" fill="${palette.muted}" fill-opacity="0.8"/>`;
      })
      .join("\n  ");
    const body = `
  <g transform="translate(120 120)">
    <rect x="0" y="0" width="640" height="420" rx="16" fill="${palette.bgC}" fill-opacity="0.45" stroke="${palette.line}" stroke-width="1.2"/>
    <path d="M40 92h560" stroke="${palette.line}" stroke-width="1"/>
    <path d="M40 172h560M40 252h560M40 332h560M40 412h560" stroke="${palette.line}" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="4 8"/>
    <path d="M40 300l70-26 60 14 74-64 66 22 62-58 70 34 62-20" fill="none" stroke="${accent}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
    <g fill="${accent}">
      <circle cx="110" cy="274" r="4.5"/>
      <circle cx="244" cy="288" r="4.5"/>
      <circle cx="390" cy="226" r="4.5"/>
      <circle cx="522" cy="248" r="4.5"/>
      <circle cx="654" cy="188" r="4.5"/>
    </g>
    <g transform="translate(40 34)">
      <text x="0" y="0" fill="${palette.muted}" font-size="13" letter-spacing="2.4" font-family="ui-monospace, monospace">EVENT STREAM</text>
      <rect x="380" y="-18" width="120" height="24" rx="12" fill="${accent}" fill-opacity="0.16"/>
      <text x="440" y="-1" text-anchor="middle" fill="${accent}" font-size="12" font-family="ui-monospace, monospace">ALERT 0412</text>
    </g>
  </g>
  <g transform="translate(820 140)">
    <rect x="0" y="0" width="300" height="150" rx="14" fill="${palette.bgC}" fill-opacity="0.5" stroke="${palette.line}" stroke-width="1.2"/>
    <text x="26" y="42" fill="${palette.muted}" font-size="12" letter-spacing="2.4" font-family="ui-monospace, monospace">TRIAGE QUEUE</text>
    <text x="26" y="92" fill="${palette.text}" font-size="32" font-family="ui-monospace, monospace">07</text>
    <rect x="26" y="110" width="248" height="8" rx="4" fill="${palette.line}" fill-opacity="0.8"/>
    <rect x="26" y="110" width="150" height="8" rx="4" fill="${accent}" fill-opacity="0.55"/>
  </g>
  <g transform="translate(120 560)">
    ${barRects}
    ${ticks}
  </g>`;
    return frame(
      id,
      accent,
      "Security Operations Fundamentals",
      "Defensive Security",
      body
    );
  },
};

for (const [name, build] of Object.entries(artworks)) {
  const file = path.join(outDir, `${name}.svg`);
  fs.writeFileSync(file, build(), "utf8");
  console.log(`wrote ${path.relative(root, file)}`);
}

// Favicon + app icon share the same minimal brand mark.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#38BDF8"/>
      <stop offset="1" stop-color="#6595FF"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0C1320"/>
  <path d="M32 12l16 8v14c0 10-6.6 17-16 21-9.4-4-16-11-16-21V20z" fill="none" stroke="url(#m)" stroke-width="3"/>
  <path d="M23 33l6 6 12-14" fill="none" stroke="url(#m)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

fs.writeFileSync(path.join(root, "public", "favicon.svg"), mark, "utf8");
fs.mkdirSync(path.join(root, "src", "app"), { recursive: true });
fs.writeFileSync(path.join(root, "src", "app", "icon.svg"), mark, "utf8");
console.log("wrote public/favicon.svg and src/app/icon.svg");
