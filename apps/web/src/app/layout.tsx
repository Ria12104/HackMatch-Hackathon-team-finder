import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "PairUp",
  description: "Find your hackathon team before the deadline panic.",
  applicationName: "PairUp",
  manifest: "/manifest.webmanifest",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#faf5f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="h-full m-0">
        <AppProvider>
          <PwaRegister />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
