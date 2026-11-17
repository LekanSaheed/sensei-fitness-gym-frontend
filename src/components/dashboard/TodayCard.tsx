"use client";

import { NEW_CHECK_IN, RENEW_SUBSCRIPTION } from "@/constants/routes";
import useUser from "@/hooks/useUser";
import useWeekCheckIns from "@/hooks/useWeekCheckIns";
import { useCheckIfCheckedInTodayQuery } from "@/redux/api-slices/subscription.slice";
import { ArrowRight2, LocationTick, TickCircle } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React from "react";

/**
 * Hero card: today's check-in status, the main call to action and this week's
 * attendance strip.
 */
const TodayCard = () => {
  const user = useUser();

  const { data, isLoading, isError } = useCheckIfCheckedInTodayQuery(null);

  const { week, weekCount } = useWeekCheckIns();

  const hasCheckedIn = !!data?.data?.checkedIn;

  const hasActiveSub = !!user?.hasActiveSub;

  const firstname = user?.firstname || "there";

  const content = hasCheckedIn
    ? {
        headline: "Session logged",
        sub: `Great work, ${firstname}. You've checked in for today.`,
      }
    : hasActiveSub
    ? {
        headline: `Ready to train, ${firstname}?`,
        sub: "You haven't checked in today. Show up and log your session.",
      }
    : {
        headline: "Let's get you moving",
        sub: "You need an active plan before you can check in.",
      };

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-default-black text-white p-5 shadow-sm dark:border dark:border-border">
      {/* decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-default/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 size-32 rounded-full bg-default/10 blur-2xl" />

      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.2em] text-default-tertiary">
          {moment().format("dddd, D MMMM")}
        </p>

        {isLoading ? (
          <div className="mt-3 mb-2 space-y-2">
            <div className="h-[30px] w-[70%] rounded-[8px] bg-white/10 animate-pulse" />
            <div className="h-[12px] w-[55%] rounded-[8px] bg-white/10 animate-pulse" />
          </div>
        ) : (
          <>
            <h1 className="font-league uppercase text-[40px] leading-[0.95] mt-2 break-words">
              {content.headline}
            </h1>
            <p className="text-[13px] text-white/70 mt-2 max-w-[420px]">
              {isError
                ? "We couldn't load today's check-in status."
                : content.sub}
            </p>
          </>
        )}

        <div className="mt-4">
          {hasCheckedIn ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-default/50 px-4 py-2 text-[13px] font-semibold text-default-tertiary">
              <TickCircle size={18} color="var(--color-default)" variant="Bold" />
              Checked in today
            </span>
          ) : (
            <Link
              href={hasActiveSub ? NEW_CHECK_IN : RENEW_SUBSCRIPTION}
              className="inline-flex items-center gap-2 rounded-full bg-default px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_20px_-6px_var(--color-default)] transition active:scale-[0.97] hover:brightness-110"
            >
              {hasActiveSub ? (
                <LocationTick size={18} color="currentColor" variant="Bold" />
              ) : null}
              {hasActiveSub ? "Check in now" : "View plans"}
              <ArrowRight2 size={16} color="currentColor" />
            </Link>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2 text-[11px] uppercase tracking-[0.15em] text-white/60">
            <span>This week</span>
            <span>
              <span className="text-default-tertiary font-semibold">
                {weekCount}
              </span>{" "}
              / 7 days
            </span>
          </div>
          <ol className="grid grid-cols-7 gap-1.5">
            {week.map((day) => (
              <li key={day.key} className="flex flex-col items-center gap-1.5">
                <span
                  className={`text-[11px] ${
                    day.isToday ? "text-default-tertiary font-bold" : "text-white/50"
                  }`}
                >
                  {day.label}
                </span>
                <span
                  title={
                    day.checkedIn
                      ? `Checked in on ${moment(day.key).format("ddd D MMM")}`
                      : undefined
                  }
                  className={`size-9 rounded-full inline-flex items-center justify-center text-[12px] font-semibold transition ${
                    day.checkedIn
                      ? "bg-default text-white"
                      : day.isToday
                      ? "border-2 border-dashed border-default text-white"
                      : day.isFuture
                      ? "bg-white/[0.04] text-white/30"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {day.checkedIn ? (
                    <TickCircle size={18} color="currentColor" variant="Bold" />
                  ) : (
                    day.dayOfMonth
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default TodayCard;
