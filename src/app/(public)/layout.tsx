import LandingPageWrapper from "@/components/landing-page/wrapper";
import { League_Gothic } from "next/font/google";
import React, { ReactNode, Suspense } from "react";

const leagueGothic = League_Gothic({
  variable: "--font-league",
  weight: ["400"],
  display: "swap",
  preload: true,
});

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LandingPageWrapper>
      <Suspense>
        <div className={`${leagueGothic.variable}`}>{children}</div>
      </Suspense>
    </LandingPageWrapper>
  );
};

export default PublicLayout;
