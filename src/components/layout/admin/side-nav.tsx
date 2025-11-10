"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { admin_side_bar } from "@/constants";
import useNav from "@/hooks/useNav";
import useUser from "@/hooks/useUser";
import { collocateMemberName, getInitials } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const SideNav = () => {
  const pathname = usePathname();

  const user = useUser();

  const menus = useNav();

  console.log(menus, "MENUES");
  return (
    <aside className="max-md:hidden w-[220px] fixed left-0 bottom-0 top-0 p-4 border-r bg-white border-r-gray-300">
      <div className="relative h-[60px] w-[160px] mb-[10px]">
        <Image src={"/logo.png"} alt="logo" fill className="object-contain" />
      </div>
      <div className="flex items-center mb-4 truncate">
        <Avatar className="mr-2 shrink-0 bg-gray-500">
          <AvatarFallback>
            {getInitials(collocateMemberName(user!))}
          </AvatarFallback>
        </Avatar>
        <div className="truncate">
          <h1 className="font-semibold text-[13px]">
            {user?.firstname} {user?.lastname}
          </h1>
          <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <nav className="">
        {menus.map((menu, id) => {
          return (
            <ul
              key={id}
              className="border-b border-dashed last:border-0 border-gray-400 pt-3"
            >
              {menu.links.map((link) => {
                const isActive = link.path === pathname;
                return (
                  <li key={link.path} className="mb-3">
                    <Link
                      href={link.path}
                      className={`px-3 transition py-1  items-center hover:bg-gray-200 rounded-[5px] flex gap-2 ${
                        isActive ? "!bg-default/10 text-default" : ""
                      }`}
                    >
                      {React.createElement(link.icon, {
                        size: 16,
                        color: isActive
                          ? "var(--color-default)"
                          : "var(--color-gray-500)",
                      })}
                      <span className="text-[12px] font-medium">
                        {link?.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideNav;
