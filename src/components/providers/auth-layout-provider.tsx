"use client";

import {
  ADMIN_SIGNUP,
  COMPLETE_SIGNUP,
  FORGOT_PASSWORD,
  INACTIVITY_FEEDBACK,
  LOGIN,
  RESET_PASSWORD,
  SIGNUP,
} from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import gymBackground from "../../../public/gym-fac.jpg";
import { ArrowLeft2 } from "iconsax-react";
import { motion } from "framer-motion";

const AuthLayoutProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const pathProps: Record<
    string,
    { label: ReactNode; description: string; step?: string }
  > = {
    [SIGNUP]: {
      label: (
        <>
          Start your <span className="text-default">journey</span>
        </>
      ),
      description: "Enter your email address to get started.",
      step: "Step 1 of 2",
    },
    [COMPLETE_SIGNUP]: {
      label: (
        <>
          Create your <span className="text-default">account</span>
        </>
      ),
      description: "Complete your registration",
      step: "Step 2 of 2",
    },
    [FORGOT_PASSWORD]: {
      label: (
        <>
          Reset <span className="text-default">password</span>
        </>
      ),
      description: "Enter your email address to continue",
    },
    [RESET_PASSWORD]: {
      label: (
        <>
          Set new <span className="text-default">password</span>
        </>
      ),
      description: "Enter and confirm your new password",
    },
    [LOGIN]: {
      label: (
        <>
          Hey, <span className="text-default">Login Now</span>
        </>
      ),
      description: "Enter your username or email to login your account",
    },
    [ADMIN_SIGNUP]: {
      label: (
        <>
          Register as <span className="text-default">admin</span>
        </>
      ),
      description:
        "Enter the following details to complete your registration as an administrator",
    },
    [INACTIVITY_FEEDBACK]: {
      label: (
        <>
          We miss <span className="text-default">you</span>
        </>
      ),
      description:
        "Help us understand what's been keeping you away from the gym",
    },
  };

  const pathProp = pathProps[pathname];

  const alts: Record<
    string,
    { label: string; path: string; pathLabel: string }
  > = {
    [LOGIN]: {
      label: "Don't have an account?",
      path: SIGNUP,
      pathLabel: "Create one",
    },
    [SIGNUP]: {
      label: "Already have an account?",
      path: LOGIN,
      pathLabel: "Login",
    },
    [FORGOT_PASSWORD]: {
      label: "Take me back to",
      path: LOGIN,
      pathLabel: "Login",
    },
  };

  const alt = alts[pathname] || null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000] text-white font-gabarito">
      {/* Full-bleed gym photo with dark, gold-tinted overlay */}
      <div className="fixed inset-0">
        <Image
          src={gymBackground}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#000]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgb(195_140_47/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(0_0_0/0.7)_100%)]" />
      </div>

      <div className="relative min-h-screen flex flex-col">
        <header className="flex items-center justify-between gap-4 px-5 sm:px-8 pt-5 sm:pt-7">
          <Link href={"/"} className="relative block w-[150px] h-[50px]">
            <Image
              src={"/logo-white.png"}
              alt="SEN-SEI Fitness"
              className="object-contain object-left"
              fill
              priority
              quality={100}
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#000]/30 backdrop-blur px-3.5 py-1.5 text-[12px] text-white/80 hover:text-white hover:border-white/40 transition"
          >
            <ArrowLeft2 size={14} color="currentColor" />
            Back to home
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-[420px] rounded-[28px] border border-white/15 bg-[#000]/50 backdrop-blur-2xl shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] px-6 py-8 sm:px-8 sm:py-9"
          >
            {/* gold accent line */}
            <span className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-default to-transparent" />

            {pathProp && (
              <div className="mb-7 text-center">
                {pathProp.step ? (
                  <p className="inline-flex rounded-full bg-default/15 border border-default/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-default mb-4">
                    {pathProp.step}
                  </p>
                ) : (
                  <p className="text-[11px] uppercase tracking-[0.3em] text-default mb-3">
                    SEN-SEI Fitness
                  </p>
                )}
                <h1 className="font-league uppercase text-[40px] sm:text-[46px] leading-[0.95] tracking-tight mb-2">
                  {pathProp.label}
                </h1>
                <p className="text-[14px] text-white/65">
                  {pathProp.description}
                </p>
              </div>
            )}

            <div className="auth-form relative">{children}</div>

            {alt && (
              <p className="mt-6 pt-5 border-t border-white/10 text-center text-[14px] text-white/65">
                {alt?.label}{" "}
                <Link
                  className="text-default font-semibold hover:underline"
                  href={alt.path}
                >
                  {alt?.pathLabel}
                </Link>
              </p>
            )}
          </motion.div>
        </main>

        <footer className="pb-6 px-4 text-center text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.25em] text-white/40 whitespace-nowrap">
          Transform your body · Elevate your lifestyle
        </footer>
      </div>
    </div>
  );
};

export default AuthLayoutProvider;
