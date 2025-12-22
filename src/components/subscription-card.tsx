import { RENEW_SUBSCRIPTION } from "@/constants/routes";
import {
  PlanType,
  useGetActiveSubscriptionQuery,
  useGetCheckInAnalyticsQuery,
} from "@/redux/api-slices/subscription.slice";
import moment from "moment";
import Link from "next/link";
import React, { ReactNode } from "react";
import Button from "./button";
import { EmptyMedia } from "./ui/empty";
import { InfoCircle, MoneyRemove } from "iconsax-react";
import { useColorScheme } from "@/hooks/useColorScheme";

const SubscriptionCard = () => {
  const getActiveSubQuery = useGetActiveSubscriptionQuery(null);

  const getCheckInAnalytics = useGetCheckInAnalyticsQuery(null);

  const checkInAnalytics = getCheckInAnalytics.data?.data || null;

  const activeSub = getActiveSubQuery?.data?.data || null;

  const type = activeSub?.planType;

  const remainingCheckIns =
    (activeSub?.checkInsPerWeek || 0) -
      (checkInAnalytics?.currentSessionWeek || 0) || 0;

  const check_ins: {
    label: string;
    value: ReactNode;
    hide?: boolean;
  }[] = [
    {
      label: "Check-ins this week",
      value: checkInAnalytics?.currentSessionWeek,
      hide: type !== PlanType.SessionBased,
    },
    {
      label: "Check-ins remaining for this week",
      value: remainingCheckIns,
      hide: type !== PlanType.SessionBased,
    },
    {
      label: "Total check-ins on current plan",
      value: (
        <span>
          {checkInAnalytics?.totalOnSub}/{activeSub?.totalCheckIns}
        </span>
      ),
    },
  ].filter((s) => !s?.hide);

  const getActiveSubQueryLoading =
    getActiveSubQuery.isLoading || getActiveSubQuery.isFetching;

  const startDate = activeSub?.startDate;

  const endDate = activeSub?.endDate;

  const daysLeft = moment(endDate).diff(moment(), "days");

  const planDuration = activeSub?.planDurationInDaysSnapshot || 0;

  const daysUsed = planDuration - daysLeft;

  const width = (daysUsed / planDuration) * 100;

  const allowedDays = activeSub?.allowedDays || [];

  if (!getActiveSubQueryLoading && !getActiveSubQuery.isError && !activeSub)
    return (
      <div className="bg-white rounded-[16px] overflow-hidden dark:bg-secondary">
        <div className="p-5 flex flex-col justify-center items-center">
          <EmptyMedia variant={"icon"}>
            <MoneyRemove size={22} color="var(--color-default)" />
          </EmptyMedia>
          <p className="mb-3"> You have no active subscription</p>
          <Link href={RENEW_SUBSCRIPTION}>
            <Button label="View subscription plans" />
          </Link>
        </div>
      </div>
    );

  if (getActiveSubQueryLoading) {
    return (
      <div className="border-default/50 border rounded-[16px] h-[200px] bg-default/10  p-4.5 animate-pulse">
        <div className="h-[14px] w-[70%] bg-gray-500/30 mb-4 rounded-[10px] animate-pulse"></div>
        <div className="h-[14px] w-[60px] bg-gray-500/30 mb-2 rounded-[10px] animate-pulse"></div>
        <div className="h-[10px] w-full bg-gray-500/30 mb-2 rounded-full animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-[14px] w-[60px] bg-gray-500/30 mb-2 rounded-[10px] animate-pulse"></div>
          <div className="h-[14px] w-[60px] bg-gray-500/30 mb-2 rounded-[10px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-default rounded-[16px] overflow-hidden dark:bg-card dark:text-card-foreground">
      <div className="bg-default/20">
        <div className="p-4.5">
          <h1 className="text-[16px] font-semibold mb-3">
            {activeSub?.planNameSnapshot}
          </h1>

          {type === PlanType.SessionBased ? (
            <div>
              <p className="mb-2 text-[14px]">
                You can check in {activeSub?.checkInsPerWeek}x per week for a
                total of {activeSub?.totalCheckIns} days across these days until{" "}
                {moment(activeSub?.endDate).format("llll")}
              </p>
              <ul className="flex">
                {allowedDays.map((day, id) => {
                  return (
                    <li
                      className="text-[12px] bg-default-tertiary text-black px-2 py-1"
                      key={id}
                    >
                      {day}
                    </li>
                  );
                })}
              </ul>
              <div className="flex mt-2 gap-1">
                <InfoCircle color="var(--color-amber-200)" size={16} />
                <p className="text-[12px] leading-[140%] text-amber-800 dark:text-amber-200 ">
                  Ensure you check-in to the gym on your session days as there
                  are no rollovers for missed days
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[14px] tracking-tight text-gray-500 mb-1 dark:text-secondary-foreground">
                {daysLeft} day{daysLeft > 1 ? "s" : ""} left
              </p>
              <div className="relative overflow-hidden rounded-full  flex items-center mb-2">
                <div className="bg-white absolute rounded-full inset-0 h-[5px] top-[1px]"></div>
                <div
                  className="bg-default h-[7px] rounded-full relative z-[1]"
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="flex justify-between text-[12px] tracking-tight">
                <span>{moment(startDate).format("DD MMM, YYYY")}</span>
                <span>{moment(endDate).format("DD MMM, YYYY")}</span>
              </div>
            </div>
          )}
        </div>
        <ul className="p-4.5 pt-3  border-t border-t-default/70 ">
          {check_ins.map((check_in, id) => {
            return (
              <li
                key={id}
                className="tracking-tight  flex justify-between text-[14px] mb-1.5"
              >
                <span className="">{check_in.label} </span>{" "}
                <span className="font-semibold">{check_in.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionCard;
