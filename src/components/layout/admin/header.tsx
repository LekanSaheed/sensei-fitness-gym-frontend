"use client";
import React, { FunctionComponent } from "react";
import { useIsSubPath } from "../mobile-nav";
import { ArrowLeft } from "iconsax-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ACCESS_CONTROL,
  ACTIVITY_ZONE_SETTINGS,
  ADMIN_NOTIFICATION_SETTINGS,
  ACTIVITY_ZONES,
  ADMIN_DASHBOARD,
  ADMIN_SECURITY_SETTINGS,
  ADMIN_SETTINGS,
  MANAGE_PLANS,
  MEMBERS,
  PAYMENT_LOGS,
  USER_CHECK_INS,
  USERS_SUBSCRIPTIONS,
} from "@/constants/routes";

const Header = () => {
  const isSubPath = useIsSubPath();

  const router = useRouter();

  const pathname = usePathname();

  const params = useParams();

  const searchParams = useSearchParams();

  const memberName = searchParams.get("name");

  const MEMBER_ROUTE = `${MEMBERS}/${params?.member}`;

  const namePrefix = memberName?.split(" ")[0];

  const pathLabels: Record<string, { label: string; isSub?: boolean }> = {
    [ADMIN_DASHBOARD]: {
      label: "Home",
    },
    [USER_CHECK_INS]: {
      label: "Check Ins",
    },
    [MEMBERS]: {
      label: "Members",
    },
    [MEMBER_ROUTE]: {
      label: memberName || "Member",
    },
    [MANAGE_PLANS]: {
      label: "Subscription Plans",
    },
    [`${MEMBER_ROUTE}/check-ins`]: {
      label: `${namePrefix || "Member"} Check-ins`,
    },
    [`${MEMBER_ROUTE}/subscriptions`]: {
      label: `${namePrefix || "Member"} Subscriptions`,
    },
    [`${MEMBER_ROUTE}/payments`]: {
      label: `${namePrefix || "Member"} Payments Logs`,
    },
    [PAYMENT_LOGS]: {
      label: "Payments Logs",
    },
    [USERS_SUBSCRIPTIONS]: {
      label: "Member Subscriptions",
    },
    [ACCESS_CONTROL]: {
      label: "Access Control",
    },
    [ADMIN_SETTINGS]: {
      label: "Profile Settings",
      isSub: true,
    },
    [ADMIN_SECURITY_SETTINGS]: {
      label: "Security Settings",
    },
    [ADMIN_NOTIFICATION_SETTINGS]: {
      label: "Notification Settings",
    },
    [ACTIVITY_ZONES]: {
      label: "Activity Zones",
    },
    [ACTIVITY_ZONE_SETTINGS]: {
      label: "Activity Zone Settings",
    },
  };

  const pathlabel = pathLabels[pathname] || { label: "Route" };

  const showBack = isSubPath || pathlabel?.isSub;

  return (
    <header className="md:sticky md:top-0 z-[4] h-[72px] flex items-center gap-3 px-4 md:px-8 bg-[#f5f5f4]/85 backdrop-blur-md border-b border-black/5">
      {showBack && (
        <button
          aria-label="Go back"
          onClick={() => router.back()}
          className="size-10 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center transition hover:border-default active:scale-95"
        >
          <ArrowLeft size={18} color="var(--color-default-black)" />
        </button>
      )}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.25em] text-default font-semibold">
          Admin
        </p>
        <h1 className="text-[22px] md:text-[26px] font-black tracking-tight leading-tight truncate">
          {pathlabel?.label || "Route"}
        </h1>
      </div>
    </header>
  );
};

export default Header;
