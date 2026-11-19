"use client";
import Button from "@/components/button";
import SectionLoader from "@/components/SectionLoader";
import { RENEW_SUBSCRIPTION } from "@/constants/routes";
import {
  SubscriptionStatus,
  useGetSubscriptionsHistoryInfiniteQuery,
} from "@/redux/api-slices/subscription.slice";
import FormatNumber from "@/utils/format-number";
import { ArrowRight2, Crown1, Profile2User, ReceiptText } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React from "react";

const statusStyles: Record<SubscriptionStatus, { pill: string; dot: string }> = {
  active: {
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  expired: {
    pill: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  canceled: {
    pill: "bg-gray-500/10 text-gray-600 dark:text-gray-300",
    dot: "bg-gray-500",
  },
  scheduled: {
    pill: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

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

  return (
    <div className="pt-2">
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!loading && !isError && subscriptions.length === 0 && (
        <div className="rounded-[24px] bg-white border border-gray-200/70 dark:bg-card dark:border-border p-8 text-center">
          <span className="size-16 rounded-full bg-default/10 inline-flex items-center justify-center mb-3">
            <ReceiptText size={28} color="var(--color-default)" variant="Bulk" />
          </span>
          <p className="font-league uppercase text-[24px] leading-none mb-2">
            No plans yet
          </p>
          <p className="text-[13px] text-gray-500 dark:text-muted-foreground mb-5">
            Your membership history will show up here.
          </p>
          <Link
            href={RENEW_SUBSCRIPTION}
            className="inline-flex items-center gap-2 rounded-full bg-default px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            View plans
            <ArrowRight2 size={16} color="currentColor" />
          </Link>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {subscriptions.map((subscription) => {
          const status = statusStyles[subscription.status] || statusStyles.canceled;

          const isActive = subscription.status === "active";

          const days = subscription?.planDurationInDaysSnapshot;

          return (
            <li
              key={subscription._id}
              className={`rounded-[22px] p-4 border ${
                isActive
                  ? "bg-white border-default dark:bg-card"
                  : "bg-white border-gray-200/70 dark:bg-card dark:border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`size-11 shrink-0 rounded-[14px] inline-flex items-center justify-center ${
                    isActive ? "bg-default" : "bg-default/10"
                  }`}
                >
                  <Crown1
                    size={20}
                    variant="Bold"
                    color={isActive ? "var(--color-white)" : "var(--color-default)"}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold leading-tight">
                      {subscription?.planNameSnapshot}
                    </h2>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${status.pill}`}
                    >
                      <span className={`size-[6px] rounded-full ${status.dot}`} />
                      {subscription?.status}
                    </span>
                  </div>
                  <p className="font-league text-[28px] leading-none mt-1">
                    {FormatNumber.ngnAmount(subscription?.planBasePriceSnapshot)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="rounded-full bg-gray-500/10 px-2.5 py-1 text-[12px] dark:bg-secondary">
                  {days} day{days > 1 ? "s" : ""}
                </span>
                {subscription?.includesTrainer && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-default/10 border border-default/30 px-2.5 py-1 text-[12px] text-default-secondary dark:text-default-tertiary">
                    <Profile2User size={12} color="currentColor" variant="Bold" />
                    Trainer ·{" "}
                    {FormatNumber.ngnAmount(subscription?.trainerFeeSnapshot || 0)}
                  </span>
                )}
              </div>

              <p className="text-[12px] text-muted-foreground mt-3 pt-3 border-t border-gray-200/70 dark:border-border">
                {moment(subscription?.startDate).format("llll")} -{" "}
                {moment(subscription?.endDate).format("llll")}
              </p>
            </li>
          );
        })}
      </ul>

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            label="Load More"
            loading={isFetchingNextPage}
            onClick={fetchNextPage}
            variant="outlined"
            color="black"
            fullRadius
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
