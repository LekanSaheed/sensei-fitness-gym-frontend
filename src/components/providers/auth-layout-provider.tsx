"use client";

import {
  ADMIN_SIGNUP,
  COMPLETE_SIGNUP,
  FORGOT_PASSWORD,
  LOGIN,
  RESET_PASSWORD,
  SIGNUP,
} from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import gymFac from "../../../public/gym-fac.jpg";

const AuthLayoutProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const pathProps: Record<string, { label: ReactNode; description: string }> = {
    [SIGNUP]: {
      label: "Sign Up",
      description: "Enter your email address to get started.",
    },
    [COMPLETE_SIGNUP]: {
      label: "Register",
      description: "Complete your registration",
    },
    [FORGOT_PASSWORD]: {
      label: "Reset Password",
      description: "Enter your email address to continue",
    },
    [RESET_PASSWORD]: {
      label: "Set New Password",
      description: "Enter and confirm your new password",
    },
    [LOGIN]: {
      label: (
        <p>
          Hey, <br className="sm:hidden" />
          Login Now
        </p>
      ),
      description: "Enter your username or email to login your account",
    },
    [ADMIN_SIGNUP]: {
      label: "Register as admin",
      description:
        "Enter the following details to complete your registration as an administrator",
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
    <div
      style={{
        backgroundImage: `url(${gymFac?.src})`,
      }}
      className="sm:p-5 pt-7 text-white font-gabarito bg-cover bg-center bg-no-repeat min-h-screen "
    >
      <div className="max-sm:px-5">
        <Link
          href={"/"}
          className="inline-block relative w-[190px] h-[60px] max-sm:mb-[100px]"
        >
          <Image
            src={"/logo-white.png"}
            alt="logo"
            placeholder="blur"
            blurDataURL="/logo-white.png"
            className="object-contain object-left"
            fill
            priority
            quality={100}
          />
        </Link>
      </div>
      <div className="flex justify-center items-center sm:pt-[80px]">
        <div className="w-full  sm:w-[400px] sm:border sm:p-[30px] border-muted-foreground/30 backdrop-blur-[2px] p-5  sm:bg-[#000]/80 ">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              {/* <div className="bg-black size-[8px]  rotate-45" /> */}
              <h1 className=" font-league uppercase text-[26px] tracking-tight mb-1">
                {pathProp?.label}
              </h1>
            </div>
            <p className="text-[14px] tracking-tight  max-sm:bg-[#000]/5  text-muted-foreground">
              {" "}
              {pathProp?.description}
            </p>
          </div>

          <div className="relative">{children}</div>
          {alt && (
            <div className="mt-5  max-sm:bg-[#000]/5 backdrop-blur-3xl text-center text-[14px] text-muted">
              {alt?.label}{" "}
              <Link className="text-default font-semibold" href={alt.path}>
                {alt?.pathLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutProvider;
