"use client";

import {
  ADMIN_SIGNUP,
  COMPLETE_SIGNUP,
  LOGIN,
  SIGNUP,
} from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

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
  };

  const alt = alts[pathname] || null;
  return (
    <div className="p-5 pt-7 font-jakarta">
      <div>
        <div className="relative w-[190px] h-[50px] max-sm:mb-[100px]">
          <Image
            src={"/logo.png"}
            alt="logo"
            placeholder="blur"
            blurDataURL="/logo.png"
            className="object-contain"
            fill
          />
        </div>
      </div>
      <div className="flex justify-center items-center sm:pt-[100px]">
        <div className="w-full sm:w-[400px] sm:border sm:rounded-[8px] sm:p-[30px] border-gray-300">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              {/* <div className="bg-black size-[8px]  rotate-45" /> */}
              <h1 className="font-black text-[26px] tracking-tight mb-1">
                {pathProp?.label}
              </h1>
            </div>
            <p className="text-[14px] tracking-tight text-gray-500">
              {" "}
              {pathProp?.description}
            </p>
          </div>

          <div className="relative">{children}</div>
          {alt && (
            <div className="mt-5 text-center text-[14px] text-gray-500">
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
