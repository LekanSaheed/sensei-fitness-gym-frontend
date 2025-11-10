import React, { ReactNode } from "react";
import SideNav from "./side-nav";
import Header from "./header";
import AdminMobileNav from "./mobile-nav";

const AdminDashboardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SideNav />
      <AdminMobileNav />
      <div className="md:ml-[220px] bg-gray-50/80 ">
        <Header />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;
