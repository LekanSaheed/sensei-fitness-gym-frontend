import LandingPageWrapper from "@/components/landing-page/wrapper";
import { League_Gothic } from "next/font/google";
import React, { ReactNode, Suspense } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LandingPageWrapper>
      <Suspense>
        <div className={`bg-[#000] min-h-screen`}>{children}</div>
      </Suspense>
    </LandingPageWrapper>
  );
};

export default PublicLayout;
