import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sweetmain.com"),
  title: "Sweet Main",
  description: "Find and support small businesses near you.",
  // How shared links look on Facebook, in texts, etc.
  openGraph: {
    siteName: "Sweet Main",
    type: "website",
    locale: "en_US",
    title: "Sweet Main",
    description: "Find and support small businesses near you.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${overpass.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
