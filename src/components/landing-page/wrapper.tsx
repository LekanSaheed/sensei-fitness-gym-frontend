import React, { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

const LandingPageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-[#000] text-white">
      <Header />
      <div className=" min-h-[80vh]">{children}</div>
      <Footer />
    </div>
  );
};

export default LandingPageWrapper;
