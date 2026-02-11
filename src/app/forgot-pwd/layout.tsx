import AuthLayoutProvider from "@/components/providers/auth-layout-provider";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <AuthLayoutProvider>{children}</AuthLayoutProvider>;
};

export default Layout;
