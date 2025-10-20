"use client";

import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import AuthProvider from "@/components/providers/auth-provider";
import ProtectedRoute from "@/guards/protected-routes";
import React, { ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <Suspense>
        <ProtectedRoute>
          <div className="bg-[#f2f2f2] font-jakarta">
            <Header />
            <div className="p-4 min-h-screen">
              {children} <div className="h-[80px]" />
            </div>

            <MobileNav />
          </div>
        </ProtectedRoute>
      </Suspense>
    </AuthProvider>
  );
};

export default DashboardLayout;
