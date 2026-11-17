"use client";

import useRouter from "@/hooks/useRouter";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FunctionComponent } from "react";

/** Segmented tab bar; the active tab gets a dark pill that slides between tabs */
const TabLinks: FunctionComponent<{
  links: { label: string; path: string }[];
  includeQuery?: boolean;
}> = ({ links, includeQuery = false }) => {
  const pathname = usePathname();

  const router = useRouter();

  return (
    <nav className="mb-5 -mx-1 overflow-x-auto [scrollbar-width:none]">
      <div className="inline-flex gap-1 rounded-full bg-white border border-gray-200/80 p-1 mx-1 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        {links.map((link, id) => {
          const isActive = link.path === pathname;
          return (
            <Link
              replace
              key={id}
              aria-current={isActive ? "page" : undefined}
              href={
                includeQuery
                  ? `${link.path}?${router.createQueryString("null", "null")}`
                  : link.path
              }
              className="relative whitespace-nowrap rounded-full px-4 py-2 text-[13px]"
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  className="absolute inset-0 rounded-full bg-default-black"
                />
              )}
              <span
                className={`relative z-[1] transition ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabLinks;
