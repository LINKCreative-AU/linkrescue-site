import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCta } from "@/components/MobileCta";
import { JsonLd, firmSchema } from "@/components/Schema";
import { SITE } from "@/lib/site";

const elza = localFont({
  src: [
    { path: "../public/fonts/ElzaText-Light.woff2", weight: "300" },
    { path: "../public/fonts/ElzaText-Regular.woff2", weight: "400" },
    { path: "../public/fonts/ElzaText-Medium.woff2", weight: "500" },
    { path: "../public/fonts/Elza-Semibold.woff2", weight: "600" },
    { path: "../public/fonts/Elza-Bold.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "LINK Rescue | Business Rescue & ATO Debt Help Australia",
    template: "%s | LINK Rescue",
  },
  description:
    "Confidential help for business owners under pressure. Take the two-minute business rescue assessment for an instant read on ATO debt, director penalties and creditor risk, then talk to advisors who map the path forward.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    siteName: "LINK Rescue",
    type: "website",
    locale: "en_AU",
  },
  alternates: { canonical: "./" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={elza.variable}>
      <body className="font-sans">
        <JsonLd data={firmSchema()} />
        <Header />
        {children}
        <Footer />
        <MobileCta />
        <Analytics />
      </body>
    </html>
  );
}
