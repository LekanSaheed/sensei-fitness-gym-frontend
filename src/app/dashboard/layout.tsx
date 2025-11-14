"use client";

import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import AuthProvider from "@/components/providers/auth-provider";
import {
  ColorSchemeProvider,
  useColorScheme,
} from "@/components/providers/color-scheme-context";
import ProtectedRoute from "@/guards/protected-routes";

import React, { ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <Suspense>
        <ProtectedRoute>
          {/* <ColorSchemeProvider> */}
          <div className="bg-[#f2f2f2] dark:bg-background font-gabarito dark:text-foreground">
            <div className="  sm:max-w-[800px] mx-auto">
              <Header />
              <div className="p-4 min-h-screen">
                {children} <div className="h-[80px]" />
              </div>

              <MobileNav />
            </div>
          </div>
          {/* </ColorSchemeProvider> */}
        </ProtectedRoute>
      </Suspense>
    </AuthProvider>
  );
};

export default DashboardLayout;
