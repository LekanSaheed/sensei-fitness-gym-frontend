"use client";
import Button from "@/components/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";
import { collocateMemberName, getInitials } from "@/utils";
import { ArrowRight2 } from "iconsax-react";
import React from "react";

const ProfilePage = () => {
  const user = useUser();

  const memberName = collocateMemberName(user!);

  const actions: { label: string }[] = [
    { label: "Update profile details" },
    { label: "Change password" },
  ];
  return (
    <div>
      <div className="flex bg-white p-4 rounded-[10px] mb-4">
        <Avatar className="size-[70px] mr-3">
          <AvatarFallback className=" border border-gray-400 !bg-white text-[20px]">
            {getInitials(memberName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-[20px] tracking-tight">
            {memberName}
          </h1>
          <p className="text-[14px] text-gray-400">{user?.email}</p>
          <p className="text-[12px] text-default">@{user?.username}</p>
        </div>
      </div>
      <ul className="bg-white p-2 mb-4">
        {actions.map((action, id) => {
          return (
            <li
              key={id}
              className="flex cursor-pointer justify-between items-center px-2 py-4 border-b last:border-b-0"
            >
              {action.label} <ArrowRight2 size={16} color="#222" />
            </li>
          );
        })}
      </ul>
      <Button size="lg" label="Logout" fullWidth color="black" />
    </div>
  );
};

export default ProfilePage;
