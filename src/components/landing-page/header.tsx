import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="bg-white sticky top-0 p-2 border-b border-b-gray-300">
      <div className="relative h-[60px] w-[160px]">
        <Image src={"/logo.png"} alt="logo" fill className="object-contain" />
      </div>
    </header>
  );
};

export default Header;
