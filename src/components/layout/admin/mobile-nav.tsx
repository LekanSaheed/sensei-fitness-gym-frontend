import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useNav from "@/hooks/useNav";
import useUser from "@/hooks/useUser";
import { collocateMemberName, getInitials } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AdminMobileNav = () => {
  const menus = useNav();

  const links = menus.flatMap((m) => m.links);

  const pathname = usePathname();

  const user = useUser();

  return (
    <>
      <div className=" flex items-center justify-between p-4 pb-2 border-b border-b-gray-400">
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
        <div className="flex items-center gap-2">
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
      </div>
      <nav className="md:hidden sticky z-[1000] top-0 bg-white">
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
