import {
  NEW_CHECK_IN,
  RENEW_SUBSCRIPTION,
  SUBSCRIPTIONS,
} from "@/constants/routes";
import { HeartTick, Icon, LocationTick, RefreshCircle } from "iconsax-react";
import Link from "next/link";
import React from "react";
import useUser from "@/hooks/useUser";
import SectionTitle from "./dashboard/SectionTitle";

const QuickActions = () => {
  const user = useUser();

  const actions: {
    label: string;
    description: string;
    path: string;
    icon: Icon;
    disabled?: boolean;
    primary?: boolean;
  }[] = [
    {
      label: "Check In Now",
      description: user?.hasActiveSub ? "Log today" : "Needs a plan",
      path: NEW_CHECK_IN,
      icon: LocationTick,
      disabled: !user?.hasActiveSub,
      primary: true,
    },
    {
      label: "View Plans",
      description: "Renew or upgrade",
      path: RENEW_SUBSCRIPTION,
      icon: HeartTick,
    },
    {
      label: "Plan History",
      description: "Past plans",
      path: SUBSCRIPTIONS,
      icon: RefreshCircle,
    },
  ];

  return (
    <section>
      <SectionTitle>Quick actions</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, id) => {
          const disabled = action?.disabled;

          const highlighted = action.primary && !disabled;

          return (
            <Link
              scroll={true}
              aria-disabled={disabled}
              key={id}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                }
              }}
              href={action.path}
              className={`flex flex-col rounded-[18px] p-3.5 sm:p-4 border transition active:scale-[0.97] aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-60 ${
                highlighted
                  ? "bg-default border-default text-white shadow-[0_8px_24px_-10px_var(--color-default)]"
                  : "bg-white border-gray-200/70 dark:bg-card dark:border-border"
              }`}
            >
              <span
                className={`size-10 rounded-[12px] inline-flex items-center justify-center mb-3 ${
                  highlighted
                    ? "bg-white/20"
                    : disabled
                    ? "bg-gray-500/10"
                    : "bg-default/10"
                }`}
              >
                {React.createElement(action?.icon, {
                  size: 22,
                  variant: "Bold",
                  color: highlighted
                    ? "var(--color-white)"
                    : disabled
                    ? "var(--color-gray-500)"
                    : "var(--color-default)",
                })}
              </span>
              <span className="text-[13px] font-semibold leading-tight tracking-tight">
                {action.label}
              </span>
              <span
                className={`text-[11px] mt-0.5 ${
                  highlighted
                    ? "text-white/80"
                    : "text-gray-500 dark:text-muted-foreground"
                }`}
              >
                {action.description}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
