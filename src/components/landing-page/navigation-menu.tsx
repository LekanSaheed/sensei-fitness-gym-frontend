"use client";
import { LOGIN, SIGNUP } from "@/constants/routes";
import { RootState } from "@/redux";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import Button from "../button";
import { createPortal } from "react-dom";
import { isWindow } from "@/utils";
import { landing_page_nav_links } from "@/constants";

const NavigationMenu = () => {
  const { navigation } = useSelector((state: RootState) => state["app"]);

  if (!isWindow) return;

  return createPortal(
    <AnimatePresence>
      {navigation && (
        <div className="fixed pt-[100px] px-4 inset-0 bg-[#000]/50 backdrop-blur-2xl z-[2]">
          <nav>
            <ul className="flex flex-col items-center pt-[50px] justify-center gap-8">
              {landing_page_nav_links.map((link, id) => {
                return (
                  <li key={id} className="mb-4">
                    <Link
                      href={link.path}
                      className="text-[20px] !font-league tracking-tight text-white  uppercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex gap-4 mt-10 justify-center">
            <Link href={LOGIN}>
              <Button
                label="Login"
                variant="outlined"
                size="lg"
                className="font-league text-[20px] !rounded-none uppercase"
              />
            </Link>
            <Link href={SIGNUP}>
              <Button
                label="Register"
                font="regular"
                size="lg"
                className="font-league text-[20px] !rounded-none uppercase"
              />
            </Link>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NavigationMenu;
