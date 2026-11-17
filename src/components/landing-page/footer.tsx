import { CONTACT_US, PRIVAY_POLICY, TERMS } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const links: { label: string; href: string }[] = [
    { label: "Privacy Policy", href: PRIVAY_POLICY },
    { label: "Terms of Service", href: TERMS },
    { label: "Contact Us", href: CONTACT_US },
  ];
  return (
    <footer className="border-t border-white/10 bg-[#000]">
      <div className="container mx-auto max-w-7xl px-4 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between max-md:items-center max-md:text-center">
        <div className="max-md:flex max-md:flex-col max-md:items-center">
          <Link href="/" className="relative block h-[52px] w-[150px]">
            <Image
              src="/logo-white.png"
              alt="SEN-SEI Fitness"
              fill
              className="object-contain md:object-left"
            />
          </Link>
          <p className="mt-2 text-[12px] uppercase tracking-[0.25em] text-default">
            Promoting wellness
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link, id) => (
            <Link
              key={id}
              href={link.href}
              className="text-[13px] text-white/70 hover:text-default transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 py-5 text-[12px] text-white/40 text-center md:text-left">
          &copy; {new Date().getFullYear()} Sensei Fitness. All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
