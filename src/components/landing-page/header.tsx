"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import HamdburgerMenu from "./hamburger-menu";

import NavigationMenu from "./navigation-menu";
import { landing_page_nav_links } from "@/constants";
import Link from "next/link";
import { LOGIN, SIGNUP } from "@/constants/routes";
import { motion, stagger, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const MotionLink = motion.create(Link);

export const staggerContainerVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1, {}),
    },
  },
};

export const staggerChildrenVariant: Variants = {
  hidden: { filter: "blur(20px)" },
  visible: {
    filter: "none",
  },
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "z-[20] sticky top-0 px-4 transition-all duration-300",
        scrolled
          ? "bg-[#000]/80 backdrop-blur-xl border-b border-white/10 py-1"
          : "bg-transparent border-b border-transparent py-3"
      )}
    >
      <div className="flex container mx-auto justify-between items-center max-w-7xl gap-4">
        <Link href={"/"} className="relative h-[56px] w-[150px] shrink-0">
          <Image
            quality={100}
            priority
            placeholder="blur"
            blurDataURL="/logo-white.png"
            src={"/logo-white.png"}
            alt="SEN-SEI Fitness"
            fill
            className="object-contain object-left"
          />
        </Link>
        <DesktopNavigation />
        <div className="lg:hidden">
          <HamdburgerMenu />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariant}
          className="hidden lg:flex items-center gap-2"
        >
          <Link
            href={LOGIN}
            className="font-league uppercase text-[19px] tracking-wide px-5 py-2 text-white/80 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href={SIGNUP}
            className="font-league uppercase text-[19px] tracking-wide px-6 py-2 rounded-full bg-default text-white shadow-[0_8px_24px_-10px_var(--color-default)] transition hover:brightness-110 active:scale-[0.97]"
          >
            Join now
          </Link>
        </motion.div>
      </div>
      <NavigationMenu />
    </header>
  );
};

const DesktopNavigation = () => {
  const pathname = usePathname();
  return (
    <motion.nav
      initial={"hidden"}
      animate="visible"
      variants={staggerContainerVariant}
      className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1"
    >
      {landing_page_nav_links.map((link, id) => {
        const isActive = link.path === pathname;
        return (
          <MotionLink
            variants={staggerChildrenVariant}
            className={cn(
              "font-league uppercase text-[18px] tracking-wide px-4 py-1.5 rounded-full transition",
              isActive
                ? "bg-default/15 text-default"
                : "text-white/70 hover:text-white"
            )}
            href={link.path}
            key={id}
          >
            {link.label}
          </MotionLink>
        );
      })}
    </motion.nav>
  );
};
export default Header;
