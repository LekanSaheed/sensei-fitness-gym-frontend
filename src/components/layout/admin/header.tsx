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

  console.log(MEMBER_ROUTE);

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
  };

  const pathlabel = pathLabels[pathname] || { label: "Route" };

  return (
    <header className="h-[70px] flex items-center px-4 ">
      {(isSubPath || pathlabel?.isSub) && (
        <ArrowLeft
          size={30}
          onClick={() => router.back()}
          className="cursor-pointer mr-4"
          color="#000"
        />
      )}
      <h1 className="text-[24px] font-black ">{pathlabel?.label || "Route"}</h1>
    </header>
  );
};

export default Header;
