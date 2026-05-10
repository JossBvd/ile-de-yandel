import type { Metadata, Viewport } from "next";
import { Baloo_2, Lexend } from "next/font/google";
import "./globals.css";
import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";
import { AudioDescriptionProvider } from "@/components/ui/AudioDescriptionProvider";
import { SkipLink } from "@/components/ui/SkipLink";
import { ReadingAidEffect } from "@/components/ui/ReadingAidEffect";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-reading-aid",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Le crash de Yandel",
  description: "Escape game éducatif interactif pour les élèves de 6ᵉ et 5ᵉ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Le crash de Yandel",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f7941d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${baloo.variable} ${lexend.variable} antialiased`}
        style={{
          margin: 0,
          padding: 0,
          top: 0,
          left: 0,
        }}
      >
        <AudioDescriptionProvider>
          <ReadingAidEffect />
          <SkipLink />
          {children}
          <PWAInstallPrompt />
        </AudioDescriptionProvider>
      </body>
    </html>
  );
}
