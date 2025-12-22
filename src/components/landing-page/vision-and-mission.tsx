import React from "react";
import HeadingText from "./heading-text";

const VisionAndMission = () => {
  return (
    <section className="bg-default-black py-[20px] md:py-[30px] lg:py-[40px] xl:py-[50px] 2xl:py-[60px] px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-[40px] md:mb-[50px] lg:mb-[60px] xl:mb-[70px] 2xl:mb-[100px]">
          <HeadingText centered>
            Our <span className="text-default">Mission & Vision</span>
          </HeadingText>
        </div>
        <div className="sm:flex sm:gap-4 items-stretch">
          <div className="sm:basis-1/2 h-auto">
            <div className="p-4 border border-default-tertiary sm:p-5 md:p-6 lg:p-7 h-full mb-4 text-muted/80 text-[12px] sm:mb-0">
              <HeadingText centered>Vision</HeadingText>
              <p className="text-center md:text-[14px]">
                {" "}
                Become a leading fitness brand in Nigeria, Africa and the world{" "}
              </p>
            </div>
          </div>
          <div className="sm:basis-1/2">
            <div className="p-4 border border-default-tertiary sm:p-5 md:p-6 lg:p-7  text-muted/80 text-[12px]">
              <HeadingText centered>Mission</HeadingText>
              <p className="text-center md:text-[14px]">
                {" "}
                Promote wellness and transform lifestyles through expert
                training, nutrition and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionAndMission;
