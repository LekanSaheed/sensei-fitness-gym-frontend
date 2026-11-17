import Alert from "@/components/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ADMIN_SETTINGS } from "@/constants/routes";
import useNav from "@/hooks/useNav";
import useUser from "@/hooks/useUser";
import { actions } from "@/redux";
import { collocateMemberName, getInitials } from "@/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LogoutCurve, Setting2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { isNavLinkActive } from "./side-nav";

const AdminMobileNav = () => {
  const menus = useNav();

  const links = menus.flatMap((m) => m.links);

  const pathname = usePathname();

  const user = useUser();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { logout } = actions["auth"];

  const activeRef = useRef<HTMLAnchorElement | null>(null);

  // Keep the current section visible in the scrolling tab bar
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <div className="md:hidden sticky top-0 z-[6] bg-default-black text-white">
      <div className="flex items-center justify-between px-4 h-[57px]">
        <div className="relative h-[38px] w-[120px]">
          <Image
            alt="SEN-SEI Fitness"
            className="object-contain object-left"
            src={"/logo-white.png"}
            fill
          />
        </div>
        <div className="relative">
          <button
            aria-label="Account menu"
            aria-expanded={open}
            className="flex items-center gap-2"
            onClick={() => setOpen(!open)}
          >
            <Avatar className="size-9 ring-2 ring-default/50">
              <AvatarImage src={user?.profile_picture} />
              <AvatarFallback className="bg-default/20 text-default text-[12px] font-semibold">
                {getInitials(collocateMemberName(user!))}
              </AvatarFallback>
            </Avatar>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 z-[10] w-[230px] mt-2 rounded-[16px] bg-white text-black border border-gray-200 shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-[14px] truncate">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <Link
                  onClick={() => setOpen(false)}
                  href={ADMIN_SETTINGS}
                  className="flex items-center gap-2 px-4 py-3 text-[14px] hover:bg-gray-50"
                >
                  <Setting2 size={16} color="currentColor" />
                  Settings
                </Link>
                <Alert
                  alertTrigger={
                    <button className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-rose-500 hover:bg-rose-50">
                      <LogoutCurve size={16} color="currentColor" />
                      Logout
                    </button>
                  }
                  title="Logout from account"
                  onContinueClick={() => {
                    dispatch(logout(null));
                  }}
                  description="Are you sure you want to logout? Click on the continue button to proceed"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <nav className="border-t border-white/10">
        <ul className="flex overflow-x-auto gap-1.5 px-3 py-2.5 [scrollbar-width:none]">
          {links.map((link, id) => {
            const isActive = isNavLinkActive(link.path, pathname);
            return (
              <li key={id} className="shrink-0">
                <Link
                  ref={isActive ? activeRef : undefined}
                  href={link.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition ${
                    isActive
                      ? "bg-default text-black font-semibold"
                      : "text-white/70 bg-white/5"
                  }`}
                >
                  {React.createElement(link.icon, {
                    size: 14,
                    color: "currentColor",
                    variant: isActive ? "Bold" : "Linear",
                  })}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminMobileNav;
