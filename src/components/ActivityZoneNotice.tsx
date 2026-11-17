"use client";

import { NEW_CHECK_IN, RENEW_SUBSCRIPTION } from "@/constants/routes";
import useUser from "@/hooks/useUser";
import { useGetMyActivityStatusQuery } from "@/redux/api-slices/user.slice";
import { NotifiableZone, ZONE_META } from "@/types/ActivityZone";
import { Danger, InfoCircle, Warning2 } from "iconsax-react";
import Link from "next/link";
import React from "react";

const styles: Record<
  NotifiableZone,
  { container: string; button: string; icon: typeof Danger; iconColor: string }
> = {
  not_active: {
    container:
      "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/40 dark:text-amber-100",
    button: "bg-amber-500 hover:bg-amber-600 text-white",
    icon: InfoCircle,
    iconColor: ZONE_META.not_active.color,
  },
  warning: {
    container:
      "bg-orange-50 border-orange-300 text-orange-900 dark:bg-orange-500/10 dark:border-orange-500/40 dark:text-orange-100",
    button: "bg-orange-500 hover:bg-orange-600 text-white",
    icon: Warning2,
    iconColor: ZONE_META.warning.color,
  },
  danger: {
    container:
      "bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-500/10 dark:border-rose-500/40 dark:text-rose-100",
    button: "bg-rose-600 hover:bg-rose-700 text-white",
    icon: Danger,
    iconColor: ZONE_META.danger.color,
  },
};

const sinceText = (days: number | null | undefined) =>
  days === null || days === undefined
    ? "You haven't checked in yet."
    : `It's been ${days} day${days === 1 ? "" : "s"} since your last check-in.`;

/**
 * Tells members which inactivity zone they are in and nudges them to check in.
 * Hidden for Active members.
 */
const ActivityZoneNotice = () => {
  const user = useUser();

  const { data, isLoading, isError } = useGetMyActivityStatusQuery(null);

  const status = data?.data;

  if (isLoading || isError || !status || status.zone === "active") return null;

  const zone = status.zone as NotifiableZone;

  const style = styles[zone];

  if (!style) return null;

  const since = sinceText(status.daysSinceLastCheckIn);

  const messages: Record<NotifiableZone, string> = {
    not_active: `${since} Check in today to get back to the Active zone and keep your momentum going.`,
    warning: `We haven't seen you in a while. ${since} Come back and check in to get your fitness journey back on track.`,
    danger: `${since} Your fitness goals are at risk. We'd love to see you back, so check in today to return to the Active zone.`,
  };

  const canCheckIn = !!user?.hasActiveSub;

  return (
    <div
      role="status"
      className={`border-l-4 border rounded-[18px] p-4 flex gap-3 ${style.container}`}
    >
      {React.createElement(style.icon, {
        size: 24,
        color: style.iconColor,
        variant: "Bulk",
        className: "shrink-0",
      })}
      <div className="flex-1 min-w-0">
        <p className="font-semibold mb-1">
          You&apos;re in the {ZONE_META[zone].label} zone
        </p>
        <p className="text-[13px] leading-[140%]">{messages[zone]}</p>
        {!canCheckIn && (
          <p className="text-[12px] mt-1 opacity-80">
            You&apos;ll need an active plan to check in.
          </p>
        )}
        <Link
          href={canCheckIn ? NEW_CHECK_IN : RENEW_SUBSCRIPTION}
          className={`inline-block mt-3 px-4 py-2 rounded-full text-[13px] font-semibold transition ${style.button}`}
        >
          {canCheckIn ? "Check in now" : "Renew your plan"}
        </Link>
      </div>
    </div>
  );
};

export default ActivityZoneNotice;
