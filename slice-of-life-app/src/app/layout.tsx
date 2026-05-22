import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Playfair_Display, Special_Elite } from "next/font/google";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const elite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-special-elite",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Slice of Life Archive — Dexter Morgan kill record",
  description:
    "Every on-screen Dexter Morgan kill across the original series, New Blood, and Original Sin. Method, location, disposal, season arc, Code of Harry compliance. Built on Fivetran + Snowflake + dbt + Iceberg + Cortex Analyst.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06080d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${elite.variable} ${mono.variable}`}>
      <body className="miami-noir min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
