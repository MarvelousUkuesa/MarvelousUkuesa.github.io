import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader, Syne } from "next/font/google";
import { AppChrome } from "@/components/layout/AppChrome";
import { site } from "@/content/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plex.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
