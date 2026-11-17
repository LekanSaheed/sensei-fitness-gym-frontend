import { RENEW_SUBSCRIPTION } from "@/constants/routes";
import {
  PlanType,
  useGetActiveSubscriptionQuery,
  useGetCheckInAnalyticsQuery,
} from "@/redux/api-slices/subscription.slice";
import moment from "moment";
import Link from "next/link";
import React, { ReactNode } from "react";
import { InfoCircle, MoneyRemove, Crown1, ArrowRight2 } from "iconsax-react";
import ProgressRing from "./dashboard/ProgressRing";
import SectionTitle from "./dashboard/SectionTitle";

const cardClass =
  "rounded-[24px] bg-white dark:bg-card dark:text-card-foreground border border-gray-200/70 dark:border-border p-5";

const SubscriptionCard = () => {
  const getActiveSubQuery = useGetActiveSubscriptionQuery(null);

  const getCheckInAnalytics = useGetCheckInAnalyticsQuery(null);

  const checkInAnalytics = getCheckInAnalytics.data?.data || null;

  const activeSub = getActiveSubQuery?.data?.data || null;

  const type = activeSub?.planType;

  const isSessionBased = type === PlanType.SessionBased;

  const remainingCheckIns =
    (activeSub?.checkInsPerWeek || 0) -
      (checkInAnalytics?.currentSessionWeek || 0) || 0;

  const getActiveSubQueryLoading =
    getActiveSubQuery.isLoading || getActiveSubQuery.isFetching;

  const startDate = activeSub?.startDate;

  const endDate = activeSub?.endDate;

  const daysLeft = Math.max(0, moment(endDate).diff(moment(), "days"));

  const planDuration = activeSub?.planDurationInDaysSnapshot || 0;

  const daysUsed = planDuration - daysLeft;

  const allowedDays = activeSub?.allowedDays || [];

  const totalOnSub = checkInAnalytics?.totalOnSub || 0;

  const totalAllowed = activeSub?.totalCheckIns || 0;

  const details: { label: string; value: ReactNode; hide?: boolean }[] = [
    {
      label: "This week",
      value: `${checkInAnalytics?.currentSessionWeek || 0} / ${
        activeSub?.checkInsPerWeek || 0
      }`,
      hide: !isSessionBased,
    },
    {
      label: "Left this week",
      value: remainingCheckIns,
      hide: !isSessionBased,
    },
    {
      label: "Check-ins on plan",
      value: totalAllowed ? `${totalOnSub} / ${totalAllowed}` : totalOnSub,
    },
    {
      label: "Started",
      value: moment(startDate).format("DD MMM, YYYY"),
      hide: isSessionBased,
    },
    {
      label: isSessionBased ? "Valid until" : "Ends",
      value: moment(endDate).format("DD MMM, YYYY"),
    },
  ].filter((d) => !d.hide);

  if (getActiveSubQueryLoading) {
    return (
      <section>
        <SectionTitle>Membership</SectionTitle>
        <div className={`${cardClass} flex items-center gap-5 animate-pulse`}>
          <div className="size-[120px] rounded-full border-[10px] border-gray-500/15 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-[16px] w-[70%] bg-gray-500/20 rounded-[8px]" />
            <div className="h-[12px] w-[90%] bg-gray-500/20 rounded-[8px]" />
            <div className="h-[12px] w-[80%] bg-gray-500/20 rounded-[8px]" />
          </div>
        </div>
      </section>
    );
  }

  if (!getActiveSubQuery.isError && !activeSub)
    return (
      <section>
        <SectionTitle>Membership</SectionTitle>
        <div className={`${cardClass} flex flex-wrap items-center gap-4`}>
          <span className="size-14 rounded-[16px] bg-default/10 inline-flex items-center justify-center shrink-0">
            <MoneyRemove size={26} color="var(--color-default)" variant="Bulk" />
          </span>
          <div className="flex-1 min-w-[160px]">
            <p className="font-semibold">You have no active subscription</p>
            <p className="text-[13px] text-gray-500 dark:text-muted-foreground">
              Pick a plan to start checking in.
            </p>
          </div>
          <Link
            href={RENEW_SUBSCRIPTION}
            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-default px-4 py-2 text-[13px] font-semibold text-white transition active:scale-[0.97] hover:brightness-110"
          >
            View plans
            <ArrowRight2 size={14} color="currentColor" />
          </Link>
        </div>
      </section>
    );

  if (!activeSub)
    return (
      <section>
        <SectionTitle>Membership</SectionTitle>
        <div className={`${cardClass} flex items-center justify-between gap-3`}>
          <p className="text-[13px]">We couldn&apos;t load your membership.</p>
          <button
            onClick={() => getActiveSubQuery.refetch()}
            className="rounded-full border border-default px-4 py-1.5 text-[13px] font-semibold text-default"
          >
            Retry
          </button>
        </div>
      </section>
    );

  return (
    <section>
      <SectionTitle>Membership</SectionTitle>
      <div className={cardClass}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="size-9 rounded-[12px] bg-default inline-flex items-center justify-center shrink-0">
              <Crown1 size={18} color="var(--color-white)" variant="Bold" />
            </span>
            <h3 className="text-[16px] font-semibold truncate">
              {activeSub?.planNameSnapshot}
            </h3>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
            <span className="size-[6px] rounded-full bg-emerald-500" />
            Active
          </span>
        </div>

        <div className="flex items-center gap-5">
          {isSessionBased ? (
            <ProgressRing value={totalAllowed ? totalOnSub / totalAllowed : 0}>
              <span className="font-league text-[34px] leading-none">
                {totalOnSub}
                <span className="text-[20px] text-gray-400">/{totalAllowed}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-muted-foreground">
                Sessions
              </span>
            </ProgressRing>
          ) : (
            <ProgressRing value={planDuration ? daysUsed / planDuration : 0}>
              <span className="font-league text-[38px] leading-none">
                {daysLeft}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-muted-foreground">
                Day{daysLeft === 1 ? "" : "s"} left
              </span>
            </ProgressRing>
          )}

          <dl className="flex-1 min-w-0 divide-y divide-gray-200/70 dark:divide-border">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between gap-2 py-1.5 text-[13px]"
              >
                <dt className="text-gray-500 dark:text-muted-foreground">
                  {d.label}
                </dt>
                <dd className="font-semibold text-right">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {isSessionBased && (
          <div className="mt-4 pt-4 border-t border-gray-200/70 dark:border-border">
            <p className="text-[13px] mb-2">
              Check in {activeSub?.checkInsPerWeek}x per week for a total of{" "}
              {activeSub?.totalCheckIns} days, on these days:
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {allowedDays.map((day, id) => (
                <li
                  className="text-[12px] rounded-full bg-default/10 text-default-secondary dark:text-default-tertiary border border-default/30 px-3 py-1 capitalize"
                  key={id}
                >
                  {day}
                </li>
              ))}
            </ul>
            <div className="flex mt-3 gap-1.5 rounded-[12px] bg-amber-500/10 p-2.5">
              <InfoCircle
                color="var(--color-amber-500)"
                size={16}
                className="shrink-0"
              />
              <p className="text-[12px] leading-[140%] text-amber-800 dark:text-amber-200">
                Ensure you check-in to the gym on your session days as there
                are no rollovers for missed days
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SubscriptionCard;
