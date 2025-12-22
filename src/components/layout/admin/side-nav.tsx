"use client";

import Alert from "@/components/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { admin_side_bar } from "@/constants";
import useNav from "@/hooks/useNav";
import useUser from "@/hooks/useUser";
import { actions } from "@/redux";
import { collocateMemberName, getInitials } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";
import { useDispatch } from "react-redux";

const SideNav = () => {
  const pathname = usePathname();

  const user = useUser();

  const menus = useNav();

  const { logout } = actions["auth"];

  const dispatch = useDispatch();

  return (
    <aside className="max-md:hidden w-[200px] fixed left-0 bottom-0 top-0 p-4 border-r bg-[#f6f9f6] border-r-gray-300 flex flex-col">
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
      <nav className="overflow-y-auto -mx-4 px-4">
        {menus.map((menu, id) => {
          return (
            <ul key={id} className=" pt-5">
              {menu?.label && (
                <h1 className="text-[12px] font-bold px-3 mb-3">
                  {menu?.label}
                </h1>
              )}
              {menu.links.map((link) => {
                const isActive = link.path === pathname;
                return (
                  <li key={link.path} className="mb-[2px]">
                    <Link
                      href={link.path}
                      className={`px-2.5 transition py-2.5  items-center hover:bg-gray-200 rounded-full inline-flex pr-10 gap-2 ${
                        isActive ? "!bg-[#e9efe8] !font-bold" : ""
                      }`}
                    >
                      {React.createElement(link.icon, {
                        size: 18,
                        color: "#000",
                      })}
                      <span className="text-[12px] whitespace-nowrap ">
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
      <div className="mt-auto">
        <Alert
          alertTrigger={<Button className="w-full">Logout</Button>}
          title="Logout from account"
          onContinueClick={() => {
            dispatch(logout(null));
          }}
          description="Are you sure you want to logout? Click on the continue button to proceed"
        />
      </div>
    </aside>
  );
};

export default SideNav;
