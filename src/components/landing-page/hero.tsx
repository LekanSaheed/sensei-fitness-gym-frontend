import React from "react";
import Button from "../button";
import Link from "next/link";
import { SIGNUP } from "@/constants/routes";
import heroImage from "../../../public/hero-image.jpg";

const HeroSection = () => {
  return (
    <div
      className="pt-[60px] px-4 pb-[120px]"
      style={{
        backgroundImage: `url(${heroImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <div className="mb-[40px] text-center">
        <h1 className="uppercase font-league leading-[130%] text-[45px] font-bold">
          <span className=""> transform your body</span> <br />
          <span className="text-default">elevate your lifestyle.</span>
        </h1>
        <p className="font-light text-[14px] text-muted-foreground bg-[#000]/60 inline-block p-1 ">
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
    </div>
  );
};

export default HeroSection;
