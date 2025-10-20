import React, { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

const LandingPageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="p-4">{children}</div>
      <Footer />
    </>
  );
};

export default LandingPageWrapper;
