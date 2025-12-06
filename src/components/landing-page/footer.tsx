import { CONTACT_US, PRIVAY_POLICY, TERMS } from "@/constants/routes";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const links: { label: string; href: string }[] = [
    { label: "Privacy Policy", href: PRIVAY_POLICY },
    { label: "Terms of Service", href: TERMS },
    { label: "Contact Us", href: CONTACT_US },
  ];
  return (
    <footer className="py-[20px] border-t border-muted-foreground/20">
      <div className="container mx-auto max-w-7xl px-4 flex max-sm:text-center max-sm:items-center flex-col gap-2 sm:flex-row sm: justify-between">
        <nav>
          {links.map((link, id) => (
            <Link
              key={id}
              href={link.href}
              className="mr-4  text-[12px] text-muted hover:underline last:mr-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-[12px] text-muted-foreground ">
          &copy; {new Date().getFullYear()} Sensei Fitness. All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
