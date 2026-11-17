import React, { ReactNode } from "react";
import SideNav from "./side-nav";
import Header from "./header";
import AdminMobileNav from "./mobile-nav";
import { Gabarito } from "next/font/google";

const lato = Gabarito({
  weight: "variable",
  display: "swap",
  preload: true,
  subsets: ["latin", "latin-ext"],
});
const AdminDashboardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`${lato.className} min-h-screen bg-[#f5f5f4]`}>
      <SideNav />
      <AdminMobileNav />
      <div className="md:ml-[240px] min-h-screen">
        <Header />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;
