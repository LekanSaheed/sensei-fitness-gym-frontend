import Image from "next/image";
import React from "react";
import HamdburgerMenu from "./hamburger-menu";

import NavigationMenu from "./navigation-menu";

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
        </div>
        <div>
          <HamdburgerMenu />
        </div>
      </div>
      <NavigationMenu />
    </header>
  );
};

export default Header;
