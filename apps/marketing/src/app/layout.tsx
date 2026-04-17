import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NeuraVolt – DGUV V3 Prüfung bundesweit",
    template: "%s | NeuraVolt",
  },
  description:
    "DGUV V3 Betriebsmittelprüfung digital & rechtssicher. NeuraVolt übernimmt Terminplanung, Prüfung und Dokumentation für KMUs bundesweit. Ab 4,90 € pro Gerät.",
  metadataBase: new URL("https://neuravolt.de"),
  openGraph: {
    siteName: "NeuraVolt",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0a0a0a]">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
