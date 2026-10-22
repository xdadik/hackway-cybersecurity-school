import type { Metadata, Viewport } from "next";
import { Fira_Code, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
  variable: "--font-display",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-mono-code",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Hackway Academy — Online Cybersecurity Education",
    template: "%s · Hackway Academy",
  },
  description:
    "Build your cybersecurity knowledge through structured video courses designed to take you from foundational concepts to specialized security skills.",
  applicationName: "Hackway Academy",
  keywords: [
    "cybersecurity",
    "ethical hacking",
    "penetration testing",
    "security courses",
    "Hackway Academy",
  ],
  icons: {
    icon: [{ url: "/logo/hackway-mark.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/logo/hackway-apple.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Hackway Academy",
    description:
      "Structured video courses for cybersecurity fundamentals, networking, Linux, offensive and defensive security.",
    siteName: "Hackway Academy",
    type: "website",
    images: [
      {
        url: "/logo/hackway-og.png",
        width: 1200,
        height: 630,
        alt: "Hackway Academy — Online Cybersecurity Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackway Academy",
    description:
      "Structured video courses for cybersecurity fundamentals, networking, Linux, offensive and defensive security.",
    images: ["/logo/hackway-og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${firaCode.variable} dark`}
    >
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
