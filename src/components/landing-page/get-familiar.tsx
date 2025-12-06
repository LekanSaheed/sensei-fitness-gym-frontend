"use client";

import React from "react";
import HeadingText from "./heading-text";
import gymFac from "../../../public/gym-fac.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const GetFamiliar = () => {
  return (
    <section
      style={{
        backgroundImage: `url(${gymFac?.src})`,
      }}
      className="relative py-[20px] md:py-[30px] lg:py-[40px] bg-no-repeat xl:py-[50px] z-0 2xl:py-[60px] px-4 bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#000]/50 to-[#000]/70 z-0" />
      <div className="container mx-auto max-w-7xl relative z-1">
        <div className="mb-[40px] md:mb-[50px] lg:mb-[60px] xl:mb-[70px] 2xl:mb-[100px]">
          <HeadingText centered>
            Get <span className="text-default">Familiar</span>
          </HeadingText>
          <p className="text-[12px] text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[300px] md:max-w-[400px] mx-auto ">
            Take a tour of the gym and our facilities to see what we have to
            offer.
          </p>
        </div>
        <Carousel
          opts={{ loop: true, align: "center" }}
          plugins={[Autoplay({ delay: 3000 })]}
        >
          <CarouselContent className="-ml-[30px]">
            {[...Array(4)].map((_, id) => {
              return (
                <CarouselItem
                  key={id}
                  className="md:basis-1/2 lg:basis-1/3 pl-[30px]"
                >
                  <div className="relative border-[2px] border-default h-[300px] rounded-[10px] overflow-hidden w-full md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px]">
                    <Image
                      alt="facility"
                      fill
                      className="object-cover"
                      src={`/facilities/${id + 1}.jpg`}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default GetFamiliar;
