import AboutUs from "@/components/landing-page/about-us";
import ContactUs from "@/components/landing-page/contact-us";
import GetFamiliar from "@/components/landing-page/get-familiar";
import HeroSection from "@/components/landing-page/hero";
import OurPlans from "@/components/landing-page/our-plans";
import VisionAndMission from "@/components/landing-page/vision-and-mission";
import WhyChooseUs from "@/components/landing-page/why-choose-us";
import { ISubscriptionPlan } from "@/redux/api-slices/subscription.slice";
import { ResponseType } from "@/types";
import React from "react";

const HomePage = async () => {
  let data: ResponseType<{ plans: ISubscriptionPlan[] }> = await (
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions/plans`, {
      next: {
        tags: ["plans"],
      },
    })
  ).json();

  const plans = data?.data?.plans || [];

  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <AboutUs />
      <VisionAndMission />
      <GetFamiliar />
      <OurPlans plans={plans} />
      <ContactUs />
    </div>
  );
};

export default HomePage;
