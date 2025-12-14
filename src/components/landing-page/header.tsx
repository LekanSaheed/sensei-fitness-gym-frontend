import Image from "next/image";
import React from "react";
import HamdburgerMenu from "./hamburger-menu";

import NavigationMenu from "./navigation-menu";
import { landing_page_nav_links } from "@/constants";
import Link from "next/link";
import Button from "../button";
import { LOGIN, SIGNUP } from "@/constants/routes";

const Header = () => {
  return (
    <header className=" backdrop-blur-[10px] z-[20] border-b-muted-foreground/20 sticky top-0 py-2 px-4 border-b ">
      <div className="flex container mx-auto justify-between items-center max-w-7xl">
        <div className="relative h-[60px] w-[160px]">
          <Image
            quality={100}
            priority
            placeholder="blur"
            blurDataURL="/logo-white.png"
            src={"/logo-white.png"}
            alt="logo"
            fill
            className="object-contain"
          />
          <div className="hidden">
            <Image
              quality={100}
              priority
              placeholder="blur"
              blurDataURL="/logo.png"
              src={"/logo.png"}
              alt="logo"
              fill
              className="object-contain "
            />
          </div>
        </div>
        <DesktopNavigation />
        <div className="lg:hidden">
          <HamdburgerMenu />
        </div>
        <div className="hidden lg:flex">
          <Link href={LOGIN}>
            <Button
              label="Login"
              className="font-league uppercase text-[20px] rounded-none"
              font="regular"
              variant="outlined"
            />
          </Link>
          <Link href={SIGNUP} className="">
            <Button
              label="Register"
              className="font-league uppercase text-[20px] rounded-none"
              font="regular"
            />
          </Link>
        </div>
      </div>
      <NavigationMenu />
    </header>
  );
};

const DesktopNavigation = () => {
  return (
    <nav className="hidden lg:flex gap-8">
      {landing_page_nav_links.map((link, id) => {
        return (
          <Link
            className="font-league uppercase text-[20px] tracking-tight"
            href={link.path}
            key={id}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};
export default Header;
