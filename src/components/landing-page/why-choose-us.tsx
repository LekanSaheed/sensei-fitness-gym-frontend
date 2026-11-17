"use client";
import React from "react";
import { motion, stagger, Variants } from "framer-motion";
import { Apple, Flash, Icon, Profile2User, Weight } from "iconsax-react";
import SectionHeader from "./section-header";

export const staggerContainerVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.15, {}),
    },
  },
};

const staggerChildrenPullupVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
    },
  },
};

const WhyChooseUs = () => {
  const whys: { title: string; desc: string; icon: Icon }[] = [
    {
      title: "Personal Training",
      desc: "Our gyms offer personalized training sessions with certified personal trainers who create customized workout plans based on individual goals",
      icon: Profile2User,
    },
    {
      title: "Equipment and Facilities",
      desc: "Train with modern, well-maintained equipment designed for strength, cardio, and functional fitness. Our clean facilities give you the comfort and safety you need to focus fully on your workout and push your limits.",
      icon: Weight,
    },
    {
      title: "Nutrition Counselling",
      desc: "Results don’t stop in the gym. Our nutrition counselling helps you understand what to eat, when to eat, and how to fuel your body based on your fitness goals, whether it’s fat loss, muscle gain, or overall wellness.",
      icon: Apple,
    },
    {
      title: "Speciality Programs",
      desc: "Build strength, speed, and confidence with our high-energy boxing sessions. Whether you’re a beginner or experienced, our coached classes deliver full-body workouts that improve endurance, coordination, and mental toughness.",
      icon: Flash,
    },
  ];

  return (
    <section className="bg-default-black py-20 md:py-28 px-4">
      <div className="container mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why SEN-SEI"
          title={
            <>
              Why <span className="text-default">choose us</span>
            </>
          }
          description="Gym workouts offer a versatile and customisable experience, allowing everyone to set specific fitness goals."
        />
        <motion.ul
          variants={staggerContainerVariant}
          initial={"hidden"}
          whileInView={"visible"}
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whys.map((why, id) => {
            return (
              <motion.li
                variants={staggerChildrenPullupVariant}
                key={id}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-7 transition duration-300 hover:-translate-y-1 hover:border-default/60 hover:bg-default/[0.06]"
              >
                <span className="pointer-events-none absolute -right-2 -top-6 font-league text-[120px] leading-none text-white/[0.04] transition group-hover:text-default/10">
                  0{id + 1}
                </span>
                <span className="relative size-12 rounded-[14px] bg-default inline-flex items-center justify-center mb-6 shadow-[0_10px_24px_-10px_var(--color-default)]">
                  {React.createElement(why.icon, {
                    size: 24,
                    color: "var(--color-white)",
                    variant: "Bold",
                  })}
                </span>
                <h3 className="relative font-league text-[28px] leading-none tracking-tight uppercase mb-3">
                  {why?.title}
                </h3>
                <p className="relative text-[14px] leading-relaxed text-white/60">
                  {why?.desc}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
};

export default WhyChooseUs;
