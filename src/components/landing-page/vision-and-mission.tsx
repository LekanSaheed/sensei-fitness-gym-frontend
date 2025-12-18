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
          {/* <p className="text-[12px] text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
            Get to know us
          </p> */}
        </div>
        <div className="sm:flex sm:gap-4 justify-stretch">
          <div className="sm:basis-1/2 h-auto">
            <div className="p-4 border border-default h-auto mb-4 text-muted/80 text-[12px] sm:mb-0">
              <HeadingText centered>Vision</HeadingText>
              <p className="text-center">
                {" "}
                Become a leading fitness brand in Nigeria, Africa and the world{" "}
              </p>
            </div>
          </div>
          <div className="sm:basis-1/2">
            <div className="p-4 border border-default  text-muted/80 text-[12px]">
              <HeadingText centered>Mission</HeadingText>
              <p className="text-center">
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
