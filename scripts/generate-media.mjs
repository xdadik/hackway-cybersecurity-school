/**
 * Generates the sample lesson media used by the demonstration catalogue.
 *
 * Every clip is a real, playable H.264 MP4 produced locally with ffmpeg so
 * the player, progress tracking and streaming route can be exercised without
 * shipping third-party footage. Replace these files with real lesson
 * recordings (see README -> Adding lesson media).
 *
 * Run with: npm run generate:media
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const videoDir = path.join(root, "media", "videos");
const captionDir = path.join(root, "media", "captions");
const fontDir = path.join(root, "media", "fonts");
fs.mkdirSync(videoDir, { recursive: true });
fs.mkdirSync(captionDir, { recursive: true });
fs.mkdirSync(fontDir, { recursive: true });

// ffmpeg filter strings cannot contain a Windows drive letter, so the fonts
// are copied next to the project and referenced with relative paths.
const SYSTEM_FONTS = {
  "media/fonts/segoeui.ttf": "C:/Windows/Fonts/segoeui.ttf",
  "media/fonts/segoeuib.ttf": "C:/Windows/Fonts/segoeuib.ttf",
  "media/fonts/consola.ttf": "C:/Windows/Fonts/consola.ttf",
};
for (const [target, source] of Object.entries(SYSTEM_FONTS)) {
  const targetPath = path.join(root, target);
  if (!fs.existsSync(targetPath)) {
    if (!fs.existsSync(source)) {
      throw new Error(`Required font not found: ${source}`);
    }
    fs.copyFileSync(source, targetPath);
  }
}

const FONT_SANS = "media/fonts/segoeui.ttf";
const FONT_BOLD = "media/fonts/segoeuib.ttf";
const FONT_MONO = "media/fonts/consola.ttf";

const CLIPS = [
  { key: "orientation", title: "Orientation", accent: "0x38BDF8", label: "WELCOME" },
  { key: "foundations", title: "Cybersecurity Fundamentals", accent: "0x38BDF8", label: "FOUNDATIONS" },
  { key: "networking", title: "Computer Networking for Security", accent: "0x38BDF8", label: "NETWORKING" },
  { key: "linux", title: "Linux Essentials for Cybersecurity", accent: "0x6595FF", label: "LINUX" },
  { key: "websec", title: "Web Application Security", accent: "0x6595FF", label: "APPLICATION SECURITY" },
  { key: "offensive", title: "Introduction to Penetration Testing", accent: "0x6595FF", label: "OFFENSIVE SECURITY" },
  { key: "defensive", title: "Security Operations Fundamentals", accent: "0x38BDF8", label: "DEFENSIVE SECURITY" },
  { key: "closing", title: "Summary and Next Steps", accent: "0x38BDF8", label: "SUMMARY" },
];

const DURATION = 30;

function buildFilter(clip) {
  const accent = clip.accent;
  const escapedTitle = clip.title.replace(/:/g, "\\:");
  return [
    `drawgrid=w=64:h=64:t=1:c=0x1B2738@0.45`,
    `drawbox=x='-120+1500*mod(t,6)/6':y=170:w=420:h=420:color=${accent}@0.10:t=fill`,
    `drawbox=x='1600-1500*mod(t,6)/6':y=250:w=300:h=300:color=0x6595FF@0.09:t=fill`,
    `drawbox=x=0:y='mod(t*160,760)-40':w=1280:h=3:color=${accent}@0.22:t=fill`,
    `drawtext=fontfile=${FONT_MONO}:text='${clip.label}':fontcolor=0x758399@0.9:fontsize=26:x=90:y=120`,
    `drawtext=fontfile=${FONT_BOLD}:text='${escapedTitle}':fontcolor=0xF5F7FB:fontsize=62:x=(w-text_w)/2:y=(h-text_h)/2-30`,
    `drawtext=fontfile=${FONT_SANS}:text='Hackway Academy - sample lesson media':fontcolor=0xA6B2C3:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2+70`,
    `drawtext=fontfile=${FONT_MONO}:text='SAMPLE MEDIA - FULL LESSON RECORDING PENDING UPLOAD':fontcolor=0x758399:fontsize=22:x=(w-text_w)/2:y=h-110`,
    `fade=t=in:st=0:d=0.8`,
    `fade=t=out:st=${DURATION - 1.6}:d=1.6`,
    `format=yuv420p`,
  ].join(",");
}

for (const clip of CLIPS) {
  const outFile = path.join(videoDir, `${clip.key}.mp4`);
  const args = [
    "-y",
    "-f",
    "lavfi",
    "-i",
    `gradients=s=1280x720:c0=0x080D16:c1=0x101827:c2=0x0C1424:nb_colors=3:speed=0.012:d=${DURATION}:r=24`,
    "-vf",
    buildFilter(clip),
    "-t",
    String(DURATION),
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "30",
    "-profile:v",
    "main",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    outFile,
  ];

  process.stdout.write(`encoding ${clip.key}.mp4 ... `);
  execFileSync("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  const { size } = fs.statSync(outFile);
  console.log(`${Math.round(size / 1024)} KB`);

  const vtt = `WEBVTT

1
00:00:00.000 --> 00:00:08.000
${clip.label}: sample lesson media for the Hackway Academy demonstration catalogue.

2
00:00:08.000 --> 00:00:18.000
This recording stands in for the published lesson video.

3
00:00:18.000 --> 00:00:29.500
Replace it with the final lesson recording before publishing this course.
`;
  fs.writeFileSync(path.join(captionDir, `${clip.key}.vtt`), vtt, "utf8");
}

console.log("media generation complete");
