import AuthLayoutProvider from "@/components/providers/auth-layout-provider";
import React, { ReactNode } from "react";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return <AuthLayoutProvider>{children}</AuthLayoutProvider>;
};

export default LoginLayout;
