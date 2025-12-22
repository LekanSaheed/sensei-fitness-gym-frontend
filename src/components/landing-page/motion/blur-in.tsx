"use client";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import * as React from "react";

export const BlurIn = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.h2
      ref={ref}
      initial={{ filter: "blur(20px)", opacity: 0 }}
      animate={isInView ? { filter: "blur(0px)", opacity: 1 } : {}}
      transition={{ duration: 1.2 }}
      className={cn(className)}
    >
      {children}
    </motion.h2>
  );
};
