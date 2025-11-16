import AuthLayoutProvider from "@/components/providers/auth-layout-provider";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <AuthLayoutProvider>{children}</AuthLayoutProvider>;
};

export default Layout;
