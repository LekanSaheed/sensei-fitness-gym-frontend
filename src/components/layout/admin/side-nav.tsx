"use client";

import Alert from "@/components/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ADMIN_DASHBOARD, ADMIN_SETTINGS } from "@/constants/routes";
import useNav from "@/hooks/useNav";
import useUser from "@/hooks/useUser";
import { actions } from "@/redux";
import { collocateMemberName, getInitials } from "@/utils";
import { LogoutCurve } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";
import { useDispatch } from "react-redux";

/** Dashboard only matches exactly; other sections also match their sub-pages */
export const isNavLinkActive = (path: string, pathname: string) =>
  path === ADMIN_DASHBOARD
    ? pathname === path
    : pathname === path || pathname.startsWith(`${path}/`);

const SideNav = () => {
  const pathname = usePathname();

  const user = useUser();

  const menus = useNav();

  const { logout } = actions["auth"];

  const dispatch = useDispatch();

  return (
    <aside className="max-md:hidden w-[240px] fixed left-0 bottom-0 top-0 z-[5] flex flex-col bg-default-black text-white border-r border-white/5">
      <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-default/15 blur-3xl" />

      <Link
        href={ADMIN_DASHBOARD}
        className="relative block h-[54px] w-[160px] mx-5 mt-5 mb-4"
      >
        <Image
          src={"/logo-white.png"}
          alt="SEN-SEI Fitness"
          fill
          className="object-contain object-left"
        />
      </Link>

      <p className="relative mx-5 mb-2 text-[10px] uppercase tracking-[0.25em] text-default">
        Admin console
      </p>

      <nav className="relative flex-1 overflow-y-auto px-3 pb-4">
        {menus.map((menu, id) => {
          return (
            <div key={id} className="pt-4">
              {menu?.label && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  {menu?.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {menu.links.map((link) => {
                  const isActive = isNavLinkActive(link.path, pathname);

                  return (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        aria-current={isActive ? "page" : undefined}
                        className={`group relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] transition ${
                          isActive
                            ? "bg-default/15 text-default font-semibold"
                            : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-default" />
                        )}
                        {React.createElement(link.icon, {
                          size: 18,
                          color: "currentColor",
                          variant: isActive ? "Bold" : "Linear",
                        })}
                        <span className="whitespace-nowrap">{link?.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="relative border-t border-white/10 p-3">
        <Link
          href={ADMIN_SETTINGS}
          className="flex items-center gap-3 rounded-[12px] p-2 hover:bg-white/5 transition"
        >
          <Avatar className="size-9 shrink-0 ring-2 ring-default/50">
            <AvatarImage src={user?.profile_picture} />
            <AvatarFallback className="bg-default/20 text-default text-[12px] font-semibold">
              {getInitials(collocateMemberName(user!))}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-[13px] truncate">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-[11px] text-white/50 truncate">{user?.email}</p>
          </div>
        </Link>
        <Alert
          alertTrigger={
            <button className="mt-1 w-full flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] text-rose-300 hover:bg-rose-500/10 transition">
              <LogoutCurve size={18} color="currentColor" />
              Logout
            </button>
          }
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
