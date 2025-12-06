import GetFamiliar from "@/components/landing-page/get-familiar";
import HeroSection from "@/components/landing-page/hero";
import WhyChooseUs from "@/components/landing-page/why-choose-us";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <GetFamiliar />
    </div>
  );
};

export default HomePage;
