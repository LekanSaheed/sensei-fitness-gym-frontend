"use client";
import { LOGIN, SIGNUP } from "@/constants/routes";
import { actions, RootState } from "@/redux";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { isWindow } from "@/utils";
import { landing_page_nav_links } from "@/constants";
import { usePathname } from "next/navigation";

const NavigationMenu = () => {
  const { navigation } = useSelector((state: RootState) => state["app"]);

  const { openNavigation } = actions["app"];

  const dispatch = useDispatch();

  const pathname = usePathname();

  if (!isWindow) return;

  const close = () => dispatch(openNavigation(false));

  return createPortal(
    <AnimatePresence>
      {navigation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed pt-[110px] px-6 inset-0 bg-[#000]/85 backdrop-blur-2xl z-[2] flex flex-col"
        >
          <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-default/25 blur-[100px]" />
          <nav className="relative">
            <ul className="flex flex-col gap-2">
              {landing_page_nav_links.map((link, id) => {
                const isActive = link.path === pathname;

                return (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.05 * id },
                    }}
                  >
                    <Link
                      onClick={close}
                      href={link.path}
                      className={`flex items-center justify-between border-b border-white/10 py-4 font-league uppercase text-[40px] leading-none tracking-tight ${
                        isActive ? "text-default" : "text-white"
                      }`}
                    >
                      {link.label}
                      <span className="text-[16px] text-white/30">
                        0{id + 1}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>
          <div className="relative grid grid-cols-2 gap-3 mt-10">
            <Link
              href={LOGIN}
              onClick={close}
              className="rounded-full border border-white/25 py-3.5 text-center font-league uppercase text-[20px] tracking-wide text-white"
            >
              Login
            </Link>
            <Link
              href={SIGNUP}
              onClick={close}
              className="rounded-full bg-default py-3.5 text-center font-league uppercase text-[20px] tracking-wide text-white"
            >
              Join now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NavigationMenu;
