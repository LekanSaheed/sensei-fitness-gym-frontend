import AboutUs from "@/components/landing-page/about-us";
import ContactUs from "@/components/landing-page/contact-us";
import GetFamiliar from "@/components/landing-page/get-familiar";
import HeroSection from "@/components/landing-page/hero";
import OurPlans from "@/components/landing-page/our-plans";
import VisionAndMission from "@/components/landing-page/vision-and-mission";
import WhyChooseUs from "@/components/landing-page/why-choose-us";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <AboutUs />
      <VisionAndMission />
      <GetFamiliar />
      <OurPlans />
      <ContactUs />
    </div>
  );
};

export default HomePage;
