"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SIGNUP } from "@/constants/routes";
import heroImage from "../../../public/sensei-dark.jpg";
import moment from "moment";
import { WordsPullUp } from "./motion/word-pull-up";
import { LettersPullUp } from "./motion/letters-pull-up";
import { BlurIn } from "./motion/blur-in";
import { motion } from "framer-motion";
import { staggerContainerVariant } from "./header";
import { ArrowRight2 } from "iconsax-react";

const disciplines = [
  "Strength",
  "Cardio",
  "Boxing",
  "Personal Training",
  "Nutrition",
  "Functional Fitness",
];

const HeroSection = () => {
  const yearsOfExperience = moment().diff(moment("2017-01-01"), "years");

  const stats: { label: string; value: string }[] = [
    { label: "Years of experience", value: `${yearsOfExperience}+` },
    { label: "Members", value: "5000+" },
    { label: "Satisfied Members", value: "4000+" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* gold glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[520px] rounded-full bg-default/20 blur-[140px]" />

      <div className="relative container mx-auto max-w-7xl px-4 pt-10 lg:pt-6 pb-16 lg:pb-24 grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-6">
        {/* Portrait: background on mobile, side image on desktop */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            placeholder="blur"
            className="object-cover object-top opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000]/30 via-[#000]/50 to-[#000]" />
        </div>

        <div className="relative z-[1] max-lg:text-center max-lg:pt-[60px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-default/40 bg-default/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-default mb-6">
            <span className="size-1.5 rounded-full bg-default animate-pulse" />
            SEN-SEI Fitness
          </p>

          <h1 className="uppercase font-league leading-[0.95] tracking-tight text-[56px] sm:text-[72px] lg:text-[88px] xl:text-[104px]">
            <WordsPullUp text="transform your body" />
            <LettersPullUp
              text="elevate your lifestyle"
              className="text-default"
            />
          </h1>

          <BlurIn className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-[520px] max-lg:mx-auto">
            Gym training is a structured and disciplined approach to physical
            exercise that focuses on strength, endurance and overall fitness
            improvement.
          </BlurIn>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            className="mt-8 flex flex-wrap gap-3 max-lg:justify-center"
          >
            <Link
              href={SIGNUP}
              className="inline-flex items-center gap-2 rounded-full bg-default px-7 py-3.5 font-league uppercase text-[20px] tracking-wide text-white shadow-[0_12px_32px_-10px_var(--color-default)] transition hover:brightness-110 active:scale-[0.97]"
            >
              Join us now
              <ArrowRight2 size={18} color="currentColor" />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-league uppercase text-[20px] tracking-wide text-white transition hover:border-default hover:text-default"
            >
              View plans
            </a>
          </motion.div>

          <motion.ul
            variants={staggerContainerVariant}
            initial="hidden"
            animate="visible"
            className="mt-10 grid grid-cols-3 gap-3 max-w-[520px] max-lg:mx-auto"
          >
            {stats.map((stat, id) => {
              return (
                <motion.li
                  variants={staggerContainerVariant}
                  key={id}
                  className="rounded-[18px] border border-white/10 bg-white/[0.04] backdrop-blur px-3 py-4 text-center"
                >
                  <p className="font-league text-[34px] md:text-[42px] leading-none text-default">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] md:text-[12px] uppercase tracking-wide text-white/60">
                    {stat.label}
                  </p>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "none",
            transition: { duration: 0.9 },
          }}
          className="relative hidden lg:block h-[640px]"
        >
          <div className="absolute inset-x-10 bottom-0 top-16 rounded-t-full border border-default/30" />
          <div className="absolute inset-x-20 bottom-0 top-28 rounded-t-full bg-default/10" />
          <Image
            src={heroImage}
            alt="SEN-SEI Fitness athlete"
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 0px"
            className="object-contain object-bottom [mask-image:radial-gradient(ellipse_48%_60%_at_50%_52%,black_60%,transparent_100%)]"
          />
        </motion.div>
      </div>

      {/* Discipline marquee */}
      <div className="relative border-y border-default/30 bg-default text-black overflow-hidden -rotate-1 scale-[1.02]">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] py-3">
          {[...disciplines, ...disciplines, ...disciplines, ...disciplines].map(
            (item, id) => (
              <span
                key={id}
                className="font-league uppercase text-[24px] md:text-[28px] tracking-wide px-6 inline-flex items-center gap-6"
              >
                {item}
                <span className="size-2 rotate-45 bg-black" />
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
