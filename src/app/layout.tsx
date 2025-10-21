import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import ReduxProvider from "../components/providers/redux-provider";
import LandingPageWrapper from "@/components/landing-page/wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
});
export const metadata: Metadata = {
  title: "Sensei Fitness",
  description: "Promoting Wellness",
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    width: "device-width",
  },
  appleWebApp: {
    capable: true,
    title: "Sensei Fitness",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} font-geist-sans antialiased`}
      >
        <ReduxProvider>
          <>{children}</>
        </ReduxProvider>
      </body>
    </html>
  );
}
