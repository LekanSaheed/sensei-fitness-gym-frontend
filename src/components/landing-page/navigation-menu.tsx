"use client";
import { LOGIN } from "@/constants/routes";
import { RootState } from "@/redux";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import Button from "../button";
import { createPortal } from "react-dom";

const NavigationMenu = () => {
  const { navigation } = useSelector((state: RootState) => state["app"]);

  return createPortal(
    <AnimatePresence>
      {navigation && (
        <div className="fixed pt-[100px] px-4 inset-0 bg-[#000]/50 backdrop-blur-2xl">
          <Link href={LOGIN}>
            <Button label="Login" />
          </Link>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NavigationMenu;
