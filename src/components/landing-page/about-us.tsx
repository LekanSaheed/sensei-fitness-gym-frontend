"use client";
import React from "react";
import HeadingText from "./heading-text";
import Button from "../button";
import Link from "next/link";
import { ABOUT_US } from "@/constants/routes";
import gymFac from "../../../public/gym-fac.jpg";
import Image from "next/image";
import { BlurIn } from "./motion/blur-in";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section
      style={{
        backgroundImage: `url(${gymFac?.src})`,
      }}
      className="relative py-[60px] sm:py-[40px] overflow-hidden md:py-[60px] bg-no-repeat lg:py-[100px] z-0 xl:py-[110px] 2xl:py-[120px] px-4 bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#000]/50 to-[#000]/70 z-0" />
      <div className="relative z-[1]">
        <div className="container mx-auto max-w-7xl">
          <div className="sm:grid sm:grid-cols-2 sm:gap-[30px]">
            <div className="">
              <div className="mb-[40px] sm:mb-[20px]">
                <HeadingText centered className="sm:!text-left">
                  About <span className="text-default">us</span>
                </HeadingText>
                <p className="text-[12px] sm:hidden text-center text-muted-foreground md:text-[14px] lg:text-[15px] xl:text-[16px] max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto ">
                  Get to know us
                </p>
              </div>

              <BlurIn className="text-[12px] text-justify sm:!text-left mb-4 text-muted/80 leading-[160%] lg:leading-[180%] sm:text-[10px] md:text-[12px] sm:mb-6">
                Welcome to SEN-SEI FITNESS, where strength is built, goals are
                crushed, and limits are redefined. We are more than just a
                fitness center, we are a community committed to growth,
                resilience, and transformation. Founded with a mission to
                inspire healthier lifestyles, our gym offers a space where
                beginners, athletes, and everyone in between can thrive. From
                state-of-the-art equipment and diverse workout programs to
                expert personal trainers and supportive group classes, we
                provide everything you need to reach your full potential.
                <br />
                <br />
                Whether you're here to gain muscle, lose weight, boost
                endurance, or simply feel better in your body, {"we’re"} here to
                support your journey every step of the way. At SEN-SEI FITNESS,
                we believe fitness is not just about the body — {"it’s"} about
                building the mindset to take on anything life throws your way.
                Come for the workout. Stay for the transformation.
              </BlurIn>
              <div className="flex justify-center sm:justify-start">
                <Link href={ABOUT_US} className="">
                  <Button
                    brandedFont
                    variant="outlined"
                    label="See More"
                    size="lg"
                  />
                </Link>
              </div>
            </div>

            <motion.div className="max-sm:hidden relative justify-self-center">
              <motion.div
                initial={{ x: 80, y: 80, filter: "blur(20px)" }}
                whileInView={{
                  x: 0,
                  y: 0,
                  filter: "none",
                  transition: {
                    duration: 0.8,
                  },
                }}
                className="h-[300px] w-[200px] absolute border border-default -top-[20px] -left-[30px]"
              />
              <motion.div
                initial={{ x: -80, y: -80, filter: "blur(120px)" }}
                whileInView={{
                  x: 0,
                  y: 0,
                  filter: "none",
                  transition: {
                    duration: 0.8,
                  },
                }}
                className="h-[300px] w-[200px] absolute border border-muted -bottom-[20px] -right-[30px]"
              />
              <motion.div
                initial={{ filter: "blur(20px)", opacity: 0 }}
                whileInView={{
                  filter: "none",
                  opacity: 1,
                  transition: {
                    duration: 0.8,
                  },
                }}
                className="relative h-[350px] w-[290px] mt-4"
              >
                <Image
                  src={"/sensei.jpg"}
                  fill
                  className="object-contain"
                  alt="sensei"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
