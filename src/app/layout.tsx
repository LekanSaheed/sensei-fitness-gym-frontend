import type { Metadata, Viewport } from "next";
import {
  Gabarito,
  Geist,
  Geist_Mono,
  League_Gothic,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

import ReduxProvider from "../components/providers/redux-provider";
import LandingPageWrapper from "@/components/landing-page/wrapper";
import { Suspense } from "react";

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

const gabarito = Gabarito({
  display: "swap",
  preload: true,
  weight: "variable",
  subsets: ["latin", "latin-ext"],
  variable: "--font-gabarito",
});
export const metadata: Metadata = {
  title: "Sensei Fitness - Promoting Wellness",
  description: "Fitness and Wellness Gym in Ilorin",
  applicationName: "Sensei Fitness",

  authors: [
    {
      name: "Sensei Fitness",
      url: "https://sensei-fitness.com",
    },
  ],
  keywords: [
    "fitness",
    "wellness",
    "health",
    "fitness in ilorin",
    "gym in ilorin",
    "boxing gym in ilorin",
    "personal training in ilorin",
    "nutrition coaching in ilorin",
    "fitness classes in ilorin",
  ],
  openGraph: {
    title: "Sensei Fitness - Promoting Wellness",
    description: "Fitness and Wellness Gym in Ilorin",
    url: "https://sensei-fitness.com",
    siteName: "Sensei Fitness",

    type: "website",
    locale: "en_NG",
    countryName: "Nigeria",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
};

const leagueGothic = League_Gothic({
  variable: "--font-league",
  weight: ["400"],
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${gabarito.variable} ${leagueGothic.variable} font-geist-sans antialiased`}
      >
        <ReduxProvider>
          <Suspense>
            <>{children}</>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
