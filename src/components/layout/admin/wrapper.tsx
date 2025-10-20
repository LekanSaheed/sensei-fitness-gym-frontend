import React, { ReactNode } from "react";
import SideNav from "./side-nav";
import Header from "./header";

const AdminDashboardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SideNav />
      <div className="md:ml-[220px]">
        <Header />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;
