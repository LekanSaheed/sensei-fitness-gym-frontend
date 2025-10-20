import LandingPageWrapper from "@/components/landing-page/wrapper";
import React, { ReactNode, Suspense } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LandingPageWrapper>
      <Suspense>{children}</Suspense>
    </LandingPageWrapper>
  );
};

export default PublicLayout;
