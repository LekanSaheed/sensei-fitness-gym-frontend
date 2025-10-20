"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FunctionComponent } from "react";

const TabLinks: FunctionComponent<{
  links: { label: string; path: string }[];
}> = ({ links }) => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-3 border-b border-b-gray-300  mb-3">
      {links.map((link, id) => {
        const isActive = link.path === pathname;
        return (
          <Link replace key={id} href={link.path} className={`text-[14px]`}>
            {" "}
            <span
              className={`py-2 transition inline-block  ${
                isActive ? "text-default" : ""
              }`}
            >
              {" "}
              {link.label}
            </span>
            {isActive && (
              <motion.span
                layoutId="underline"
                className="w-full h-[2px] rounded-full bg-default block"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default TabLinks;
