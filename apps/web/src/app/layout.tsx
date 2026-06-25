import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "HackMatch",
  description: "Find your hackathon team before the deadline panic.",
  applicationName: "HackMatch",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#faf5f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
