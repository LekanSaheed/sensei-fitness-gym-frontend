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
    <div className={`${lato.className}`}>
      <SideNav />
      <AdminMobileNav />
      <div className="md:ml-[200px] bg-gray-50/80 ">
        <Header />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;
