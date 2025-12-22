import Alert from "@/components/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ADMIN_SETTINGS } from "@/constants/routes";
import useNav from "@/hooks/useNav";
import useUser from "@/hooks/useUser";
import { actions } from "@/redux";
import { collocateMemberName, getInitials } from "@/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const AdminMobileNav = () => {
  const menus = useNav();

  const links = menus.flatMap((m) => m.links);

  const pathname = usePathname();

  const user = useUser();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { logout } = actions["auth"];

  return (
    <>
      <div className=" flex items-center md:hidden justify-between p-4 pb-2 border-b border-b-gray-400">
        <div className="relative h-[40px] w-[130px]">
          <Image
            alt="logo"
            className="object-contain"
            placeholder="blur"
            blurDataURL="/logo.png"
            src={"/logo.png"}
            fill
          />
        </div>
        <div className="relative">
          <div
            className="flex items-center gap-2 "
            onClick={() => setOpen(!open)}
          >
            <div className="text-end">
              <p className="font-semibold text-[14px]">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-[10px] text-gray-500">{user?.email}</p>
            </div>
            <Avatar className="size-10 border border-gray-400">
              <AvatarFallback>
                {getInitials(collocateMemberName(user!))}
              </AvatarFallback>
            </Avatar>
          </div>
          {open && (
            <motion.div className="absolute bg-white z-[10] w-full border mt-2 p-4 rounded-[10px] shadow-2xl">
              <Link onClick={() => setOpen(false)} href={ADMIN_SETTINGS}>
                Settings
              </Link>
              <Alert
                alertTrigger={<p className="text-rose-500">Logout</p>}
                title="Logout from account"
                onContinueClick={() => {
                  dispatch(logout(null));
                }}
                description="Are you sure you want to logout? Click on the continue button to proceed"
              />
            </motion.div>
          )}
        </div>
      </div>
      <nav className="md:hidden sticky z-[2] top-0 bg-white">
        <ul className="flex overflow-x-auto p-4  border-b border-b-gray-400 gap-4">
          {links.map((link, id) => {
            const isActive = link.path === pathname;
            return (
              <li
                key={id}
                className={`whitespace-nowrap ${
                  isActive ? "text-default" : ""
                }`}
              >
                <Link href={link.path}>{link.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default AdminMobileNav;
