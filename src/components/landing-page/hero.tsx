import React from "react";
import Button from "../button";
import Link from "next/link";
import { SIGNUP } from "@/constants/routes";

const HeroSection = () => {
  return (
    <div className="py-[40px] px-4">
      <div className="mb-[40px]">
        <h1 className="uppercase font-league tracking-wide text-[50px] font-bold">
          <span className=""> transform your body</span> <br />
          <span className="text-default">elevate your lifestyle.</span>
        </h1>
        <p className="font-light text-muted-foreground font-gabarito">
          Gym training is a structured and disciplined approach to physical
          exercise that focuses on strength, endurance and overall fitness
          improvement.
        </p>
      </div>

      <div>
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
