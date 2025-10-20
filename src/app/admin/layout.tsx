"use client";
import AdminDashboardWrapper from "@/components/layout/admin/wrapper";
import AuthProvider from "@/components/providers/auth-provider";
import PermissionRoute from "@/guards/permission-guard";
import ProtectedRoute from "@/guards/protected-routes";
import { useRouter } from "next/router";
import React, { ReactNode, Suspense } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <Suspense>
        <ProtectedRoute>
          <AdminDashboardWrapper>
            <PermissionRoute>{children}</PermissionRoute>
          </AdminDashboardWrapper>
        </ProtectedRoute>
      </Suspense>
    </AuthProvider>
  );
};

export default AdminLayout;
