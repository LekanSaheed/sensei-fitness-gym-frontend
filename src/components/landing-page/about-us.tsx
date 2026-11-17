"use client";
import React from "react";
import Link from "next/link";
import { ABOUT_US } from "@/constants/routes";
import Image from "next/image";
import { BlurIn } from "./motion/blur-in";
import { motion } from "framer-motion";
import SectionHeader from "./section-header";
import { ArrowRight2 } from "iconsax-react";
import moment from "moment";

const AboutUs = () => {
  const yearsOfExperience = moment().diff(moment("2017-01-01"), "years");

  return (
    <section className="relative overflow-hidden bg-[#000] py-20 md:py-28 px-4">
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[420px] rounded-full bg-default/10 blur-[120px]" />
      <div className="relative container mx-auto max-w-7xl grid lg:grid-cols-2 gap-14 items-center">
        {/* Image collage */}
        <motion.div
          initial={{ opacity: 0, x: -40, filter: "blur(16px)" }}
          whileInView={{
            opacity: 1,
            x: 0,
            filter: "none",
            transition: { duration: 0.8 },
          }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto w-full max-w-[460px] aspect-[4/5]"
        >
          <div className="absolute -top-4 -left-4 w-2/3 h-2/3 rounded-[28px] border border-default" />
          <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 rounded-[28px] border border-white/20" />
          <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-default-black">
            <Image
              src={"/sensei.jpg"}
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover"
              alt="sensei"
            />
          </div>
          <div className="absolute -bottom-6 left-6 rounded-[20px] bg-default px-5 py-4 text-black shadow-xl">
            <p className="font-league text-[44px] leading-none">
              {yearsOfExperience}+
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold">
              Years of experience
            </p>
          </div>
        </motion.div>

        <div>
          <SectionHeader
            align="left"
            eyebrow="Get to know us"
            title={
              <>
                About <span className="text-default">us</span>
              </>
            }
            className="!mb-6"
          />

          <BlurIn className="text-[15px] leading-[180%] text-white/70 mb-8">
            Welcome to SEN-SEI FITNESS, where strength is built, goals are
            crushed, and limits are redefined. We are more than just a fitness
            center, we are a community committed to growth, resilience, and
            transformation. Founded with a mission to inspire healthier
            lifestyles, our gym offers a space where beginners, athletes, and
            everyone in between can thrive. From state-of-the-art equipment and
            diverse workout programs to expert personal trainers and supportive
            group classes, we provide everything you need to reach your full
            potential.
            <br />
            <br />
            Whether you&apos;re here to gain muscle, lose weight, boost
            endurance, or simply feel better in your body, {"we’re"} here to
            support your journey every step of the way. At SEN-SEI FITNESS, we
            believe fitness is not just about the body — {"it’s"} about
            building the mindset to take on anything life throws your way.
            Come for the workout. Stay for the transformation.
          </BlurIn>

          <Link
            href={ABOUT_US}
            className="inline-flex items-center gap-2 rounded-full border border-default px-7 py-3 font-league uppercase text-[20px] tracking-wide text-default transition hover:bg-default hover:text-white"
          >
            See more
            <ArrowRight2 size={18} color="currentColor" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
