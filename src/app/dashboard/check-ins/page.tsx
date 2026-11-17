"use client";

import { CheckInHistory } from "@/components/CheckInsHistory";
import SectionLoader from "@/components/SectionLoader";
import StatTiles from "@/components/dashboard/StatTiles";
import SectionTitle from "@/components/dashboard/SectionTitle";
import { NEW_CHECK_IN } from "@/constants/routes";
import { useGetCheckInHistoryInfiniteQuery } from "@/redux/api-slices/subscription.slice";
import { ICheckIn } from "@/types";
import useUser from "@/hooks/useUser";
import { ArrowRight2 } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { FaPersonWalking } from "react-icons/fa6";
import MainButton from "@/components/button";

const CheckIns = () => {
  const user = useUser();

  const {
    data,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useGetCheckInHistoryInfiniteQuery({ limit: 20 });

  const checkIns =
    data?.pages?.flatMap((p) => p?.data?.data || []).flat() || [];

  const loading = (isLoading || isFetching) && !isFetchingNextPage;

  // Group sessions by month, newest first (API order is preserved)
  const groups = checkIns.reduce<{ key: string; items: ICheckIn[] }[]>(
    (acc, checkIn) => {
      const key = moment(checkIn.createdAt).format("MMMM YYYY");

      const last = acc[acc.length - 1];

      if (last?.key === key) last.items.push(checkIn);
      else acc.push({ key, items: [checkIn] });

      return acc;
    },
    []
  );

  return (
    <div className="flex flex-col gap-6 pt-2">
      <StatTiles />

      <section>
        <SectionTitle
          action={
            user?.hasActiveSub ? (
              <Link
                href={NEW_CHECK_IN}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-default"
              >
                Check in now
                <ArrowRight2 size={14} color="currentColor" />
              </Link>
            ) : undefined
          }
        >
          History
        </SectionTitle>

        <SectionLoader loading={loading} error={isError} refetch={refetch} />

        {!loading && !isError && checkIns.length > 0 && (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.key}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-[12px] uppercase tracking-[0.15em] text-gray-500 dark:text-muted-foreground">
                    {group.key}
                  </p>
                  <span className="text-[11px] font-semibold text-default">
                    {group.items.length} session
                    {group.items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ul className="rounded-[20px] bg-white border border-gray-200/70 divide-y divide-gray-200/70 dark:bg-card dark:border-border dark:divide-border">
                  {group.items.map((checkIn) => (
                    <CheckInHistory checkIn={checkIn} key={checkIn._id} />
                  ))}
                </ul>
              </div>
            ))}

            {hasNextPage && (
              <div className="flex justify-center">
                <MainButton
                  label="Load more"
                  loading={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  color="black"
                  variant="outlined"
                  size="sm"
                  fullRadius
                />
              </div>
            )}
          </div>
        )}

        {!loading && !isError && checkIns.length === 0 && (
          <div className="rounded-[24px] bg-white border border-gray-200/70 dark:bg-card dark:border-border p-8 text-center">
            <span className="size-16 rounded-full bg-default/10 inline-flex items-center justify-center mb-3">
              <FaPersonWalking size={28} color="var(--color-default)" />
            </span>
            <p className="font-league uppercase text-[24px] leading-none mb-2">
              No sessions yet
            </p>
            <p className="text-[13px] text-gray-500 dark:text-muted-foreground mb-5 max-w-[300px] mx-auto">
              Your check-ins will show up here when you start checking in to
              the gym.
            </p>
            {user?.hasActiveSub && (
              <Link
                href={NEW_CHECK_IN}
                className="inline-flex items-center gap-2 rounded-full bg-default px-5 py-2.5 text-[14px] font-semibold text-white transition active:scale-[0.97]"
              >
                Check in now
                <ArrowRight2 size={16} color="currentColor" />
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CheckIns;
