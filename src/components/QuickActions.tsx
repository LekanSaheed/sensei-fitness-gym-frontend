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
import { useGetActiveSubscriptionQuery } from "@/redux/api-slices/subscription.slice";

const QuickActions = () => {
  const getActiveSubQuery = useGetActiveSubscriptionQuery(null);

  const activeSub = getActiveSubQuery?.data?.data || null;

  const actions: {
    label: string;
    path: string;
    icon: Icon;
    disabled?: boolean;
  }[] = [
    {
      label: "Check In Now",
      path: NEW_CHECK_IN,
      icon: LocationTick,
      disabled: !activeSub,
    },
    {
      label: "Renew",
      path: RENEW_SUBSCRIPTION,
      icon: RefreshCircle,
      disabled: !!activeSub,
    },
    { label: "View My Plans", path: SUBSCRIPTIONS, icon: RefreshCircle },
  ];

  return (
    <div className="my-4">
      <Heading>Quick actions</Heading>
      <div className="flex justify-evenly gap-4">
        {actions.map((action, id) => {
          const disabled = action?.disabled;
          return (
            <Link
              aria-disabled={disabled}
              key={id}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                }
              }}
              href={action.path}
              className="inline-flex  flex-col bg-white p-3 rounded-[15px] aria-[disabled=true]:!bg-gray-700/10 items-center w-full max-w-[120px]"
            >
              <div
                className={` mb-2 size-[50px] border rounded-full inline-flex items-center justify-center ${
                  disabled
                    ? "border-gray-800/15 text-gray-500 bg-gray-500/10"
                    : "border-default/15  text-default bg-default/10 "
                }`}
              >
                {React.createElement(action?.icon, {
                  size: 24,
                })}
              </div>
              <p
                className={`text-center tracking-tight text-[12px] ${
                  disabled ? "text-gray-500" : ""
                }`}
              >
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
