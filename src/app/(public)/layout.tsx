import LandingPageWrapper from "@/components/landing-page/wrapper";
import React, { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return <LandingPageWrapper>{children}</LandingPageWrapper>;
};

export default PublicLayout;
