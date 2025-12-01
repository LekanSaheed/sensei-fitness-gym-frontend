"use client";

import { actions, RootState } from "@/redux";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button";
import { LOGIN } from "@/constants/routes";

const HamdburgerMenu = () => {
  const { openNavigation } = actions["app"];

  const { navigation } = useSelector((state: RootState) => state["app"]);

  const dispatch = useDispatch();
  return (
    <div className="">
      <div
        onClick={() => {
          dispatch(openNavigation(!navigation));
        }}
        className="cursor-pointer"
      >
        {["1", "2", "3"].map((stick) => {
          return (
            <div
              key={stick}
              className={`relative z-[100] bg-white transition origin-center h-[2.5px] w-[30px] rounded-full mb-1 last:mb-0 ${
                navigation
                  ? stick == "1"
                    ? "rotate-45 !mb-0 transition"
                    : stick == "3"
                    ? "-rotate-45 !mb-0 -mt-[5.9px] transition cursor-pointer"
                    : "scale-0 !h-0 !w-0 transition"
                  : ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HamdburgerMenu;
