"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import SectionHeader from "./section-header";

const arrowClass =
  "static translate-x-0 translate-y-0 rotate-0 size-11 rounded-full border-white/20 bg-transparent text-white hover:bg-default hover:text-white hover:border-default disabled:opacity-30";

const GetFamiliar = () => {
  return (
    <section className="relative overflow-hidden bg-[#000] py-20 md:py-28 px-4">
      <div className="pointer-events-none absolute right-0 top-0 size-[420px] rounded-full bg-default/10 blur-[120px]" />
      <div className="container mx-auto max-w-7xl relative">
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
            <SectionHeader
              align="left"
              eyebrow="Inside the gym"
              title={
                <>
                  Get <span className="text-default">Familiar</span>
                </>
              }
              description="Take a tour of the gym and our facilities to see what we have to offer."
              className="!mb-0 max-w-[560px]"
            />
            <div className="flex gap-2 shrink-0">
              <CarouselPrevious className={arrowClass} />
              <CarouselNext className={arrowClass} />
            </div>
          </div>
          <CarouselContent className="-ml-4">
            {[...Array(4)].map((_, id) => {
              return (
                <CarouselItem
                  key={id}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <div className="group relative h-[320px] lg:h-[400px] rounded-[24px] overflow-hidden border border-white/10">
                    <Image
                      alt={`SEN-SEI Fitness facility ${id + 1}`}
                      quality={100}
                      loading="eager"
                      placeholder="blur"
                      priority
                      blurDataURL={`/facilities/${id + 1}.jpg`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                      src={`/facilities/${id + 1}.jpg`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000]/70 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 font-league uppercase text-[22px] tracking-wide">
                      0{id + 1}
                    </span>
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
