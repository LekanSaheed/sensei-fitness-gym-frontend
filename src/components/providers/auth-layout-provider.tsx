"use client";

import {
  ADMIN_SIGNUP,
  COMPLETE_SIGNUP,
  LOGIN,
  SIGNUP,
} from "@/constants/routes";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const AuthLayoutProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const pathProps: Record<string, { label: string; description: string }> = {
    [SIGNUP]: {
      label: "Sign Up",
      description:
        "Join this amazing family and take your fitness to the next level",
    },
    [COMPLETE_SIGNUP]: {
      label: "Register",
      description: "Complete your registration",
    },
    [LOGIN]: {
      label: "Access your account",
      description: "Enter your username or email to access your account",
    },
    [ADMIN_SIGNUP]: {
      label: "Register as admin",
      description:
        "Enter the following details to complete your registration as an administrator",
    },
  };

  const pathProp = pathProps[pathname];
  return (
    <div className="">
      <div className="flex justify-center items-center sm:pt-[100px]">
        <div className="w-full sm:w-[400px] sm:border sm:rounded-[8px] sm:p-[30px] border-gray-300">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-black size-[8px]  rotate-45" />
              <h1 className="font-medium text-[26px] tracking-tighter">
                {pathProp?.label}
              </h1>
            </div>
            <p className="text-[14px] tracking-tight text-gray-500">
              {" "}
              {pathProp?.description}
            </p>
          </div>
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutProvider;
