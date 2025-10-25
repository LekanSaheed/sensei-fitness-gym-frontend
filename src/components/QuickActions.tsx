import {
  CHECK_INS,
  NEW_CHECK_IN,
  RENEW_SUBSCRIPTION,
  SUBSCRIPTIONS,
} from "@/constants/routes";
import { Icon, LocationTick, RefreshCircle } from "iconsax-react";
import Link from "next/link";
import React from "react";
import Heading from "./Heading";

const QuickActions = () => {
  const actions: { label: string; path: string; icon: Icon }[] = [
    { label: "Check In Now", path: NEW_CHECK_IN, icon: LocationTick },
    { label: "Renew", path: RENEW_SUBSCRIPTION, icon: RefreshCircle },
    { label: "View My Plans", path: SUBSCRIPTIONS, icon: RefreshCircle },
  ];
  return (
    <div className="my-4">
      <Heading>Quick actions</Heading>
      <div className="flex justify-evenly gap-4">
        {actions.map((action, id) => {
          return (
            <Link
              key={id}
              href={action.path}
              className="inline-flex flex-col bg-white p-3 rounded-[10px] items-center w-full max-w-[120px]"
            >
              <div className="text-default mb-2 size-[50px] border border-default/15 rounded-full inline-flex items-center justify-center bg-default/10">
                {React.createElement(action?.icon, {
                  size: 24,
                })}
              </div>
              <p className="text-center tracking-tight text-[12px]">
                {action.label}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
