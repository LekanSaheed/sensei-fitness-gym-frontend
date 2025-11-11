"use client";
import Button from "@/components/button";
import SectionLoader from "@/components/SectionLoader";
import {
  SubscriptionStatus,
  useGetSubscriptionsHistoryInfiniteQuery,
} from "@/redux/api-slices/subscription.slice";
import FormatNumber from "@/utils/format-number";
import moment from "moment";
import React from "react";

const SubscriptionsPage = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    data,
  } = useGetSubscriptionsHistoryInfiniteQuery({ limit: 24 });

  const subscriptions =
    data?.pages?.flatMap((p) => p?.data?.data || []).flat() || [];

  const loading = (isLoading || isFetching) && !isFetchingNextPage;

  const statusStyles: Record<SubscriptionStatus, string> = {
    active: "bg-emerald-600",
    expired: "bg-red-600",
    canceled: "bg-gray-600",
  };
  return (
    <div>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />
      {subscriptions.map((subscription) => {
        return (
          <div
            key={subscription._id}
            className="mb-5 p-4 bg-white  rounded-lg dark:bg-card"
          >
            <div className="flex justify-between mb-1">
              <h1 className="flex-1 font-semibold ">
                {subscription?.planNameSnapshot}
              </h1>
              <div className="shrink-0 ml-4 text-right">
                <p className="text-[14px] font-semibold">
                  {FormatNumber.ngnAmount(subscription?.planBasePriceSnapshot)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[14px]">
                Duration: {subscription?.planDurationInDaysSnapshot} day
                {subscription?.planDurationInDaysSnapshot > 1 ? "s" : ""}
              </p>
              <div className="flex items-center">
                {" "}
                <div
                  className={`${
                    statusStyles[subscription.status]
                  } size-[10px] shrink-0 rounded-full mr-1`}
                ></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {" "}
                  {subscription?.status}
                </span>
              </div>
            </div>
            {subscription?.includesTrainer && (
              <div className="text-[14px] text-default-secondary dark:text-default-tertiary mb-1">
                Includes Trainer /{" "}
                {FormatNumber.ngnAmount(subscription?.trainerFeeSnapshot || 0)}
              </div>
            )}
            <p className="text-[12px] text-muted-foreground">
              {moment(subscription?.startDate).format("llll")} -{" "}
              {moment(subscription?.endDate).format("llll")}
            </p>
          </div>
        );
      })}
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            label="Load More"
            loading={isFetchingNextPage}
            onClick={fetchNextPage}
            variant="outlined"
            color="black"
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
