import { RENEW_SUBSCRIPTION } from "@/constants/routes";
import {
  useGetActiveSubscriptionQuery,
  useGetCheckInAnalyticsQuery,
} from "@/redux/api-slices/subscription.slice";
import moment from "moment";
import Link from "next/link";
import React from "react";
import Button from "./button";
import { EmptyMedia } from "./ui/empty";
import { MoneyRemove } from "iconsax-react";

const SubscriptionCard = () => {
  const getActiveSubQuery = useGetActiveSubscriptionQuery(null);

  const getCheckInAnalytics = useGetCheckInAnalyticsQuery(null);

  const checkInAnalytics = getCheckInAnalytics.data?.data || null;

  const check_ins: { label: string; value: number | undefined }[] = [
    {
      label: "Total check-ins on current plan",
      value: checkInAnalytics?.totalOnSub,
    },
    // { label: "Check-ins this week", value: 5 },
    // { label: "Check-ins this month", value: 10 },
  ];

  const getActiveSubQueryLoading =
    getActiveSubQuery.isLoading || getActiveSubQuery.isFetching;

  const activeSub = getActiveSubQuery?.data?.data || null;

  const startDate = activeSub?.startDate;

  const endDate = activeSub?.endDate;

  const daysLeft = moment(endDate).diff(moment(), "days");

  const planDuration = activeSub?.planDurationInDaysSnapshot || 0;

  const daysUsed = planDuration - daysLeft;

  const width = (daysUsed / planDuration) * 100;

  console.log(width, daysUsed);

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

  return (
    <div className="bg-white border border-default rounded-[16px] overflow-hidden dark:bg-card dark:text-card-foreground">
      <div className="bg-default/20">
        <div className="p-4.5">
          <h1 className="text-[16px] font-semibold mb-3">
            {activeSub?.planNameSnapshot}
          </h1>

          <div>
            <p className="text-[14px] tracking-tight text-gray-500 mb-1 dark:text-secondary-foreground">
              {daysLeft} day{daysLeft > 1 ? "s" : ""} left
            </p>
            <div className="relative overflow-hidden rounded-fullh-[10px] flex items-center mb-2">
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
