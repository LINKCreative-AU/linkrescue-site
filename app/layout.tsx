import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, firmSchema } from "@/components/Schema";
import { SITE } from "@/lib/site";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en-AU" className={workSans.variable}>
      <body className="font-sans">
        <JsonLd data={firmSchema()} />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
