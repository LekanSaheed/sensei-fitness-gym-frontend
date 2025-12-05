import React from "react";
import Button from "../button";
import Link from "next/link";
import { SIGNUP } from "@/constants/routes";
import heroImage from "../../../public/hero-image.jpg";

const HeroSection = () => {
  const stats: { label: string; value: string }[] = [
    { label: "Years of experience", value: "7+" },
    { label: "Members", value: "1000+" },
    { label: "Satisfied Members", value: "800+" },
  ];

  return (
    <div
      className="pt-[100px] px-4 pb-[120px] bg-top bg-no-repeat sm:bg-center"
      style={{
        backgroundImage: `url(${heroImage.src})`,
        backgroundSize: "cover",
      }}
    >
      <div className="mb-[40px] text-center">
        <h1 className="uppercase font-league leading-[130%] tracking-tight text-[45px] sm:text-[50px] font-bold md:text-[60px] lg:text-[70px] xl:text-[80px] ">
          <span className=""> transform your body</span> <br />
          <span className="text-default">elevate your lifestyle.</span>
        </h1>
        <p className="font-light  sm:max-w-[480px] text-[14px] text-muted-foreground bg-[#000]/20 inline-block p-1 md:text-[14px] lg:max-w-[550px]">
          Gym training is a structured and disciplined approach to physical
          exercise that focuses on strength, endurance and overall fitness
          improvement.
        </p>
      </div>

      <div className="flex justify-center">
        <Link href={SIGNUP}>
          <Button
            label="JOIN US NOW"
            className="!rounded-none font-geist-sans tracking-tighter font-light"
            variant="outlined"
            size="lg"
          />
        </Link>
      </div>
      <ul className="flex bg-[#000]/40 items-center justify-center mt-8 md:mt-10 lg:mt-12 xl:mt-16">
        {stats.map((state, id) => {
          return (
            <li
              key={id}
              className=" p-4 border-r last:border-r-0 border-r-muted-foreground/30"
            >
              <div className="text-center">
                <p className="text-[24px] font-bold ">{state.value}</p>
                <p className="text-[12px] font-light text-muted-foreground">
                  {state.label}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HeroSection;
