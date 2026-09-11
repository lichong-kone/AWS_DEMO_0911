import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "蛙游记 Froggy Trails",
  description: "养一只会独自旅行的小动物 — a cozy async travel-companion.",
  manifest: "/manifest.webmanifest",
  applicationName: "蛙游记 Froggy Trails",
};

export const viewport: Viewport = {
  themeColor: "#F4EBD8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
