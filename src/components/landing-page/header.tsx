import Image from "next/image";
import React from "react";
import HamdburgerMenu from "./hamburger-menu";

import NavigationMenu from "./navigation-menu";

const Header = () => {
  return (
    <header className="backdrop-blur-[10px] z-[20] border-b-muted-foreground sticky top-0 p-2 border-b ">
      <div className="flex justify-between items-center">
        <div className="relative h-[60px] w-[160px]">
          <Image
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
