"use client";

import { CheckInHistory } from "@/components/CheckInsHistory";
import SectionLoader from "@/components/SectionLoader";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NEW_CHECK_IN } from "@/constants/routes";
import { useGetCheckInHistoryInfiniteQuery } from "@/redux/api-slices/subscription.slice";
import Link from "next/link";
import React from "react";
import { FaPersonWalking } from "react-icons/fa6";
import MainButton from "@/components/button";

const CheckIns = () => {
  const {
    data,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useGetCheckInHistoryInfiniteQuery({ limit: 20 });

  const checkIns =
    data?.pages?.flatMap((p) => p?.data?.data || []).flat() || [];

  console.log(checkIns);

  const loading = (isLoading || isFetching) && !isFetchingNextPage;
  return (
    <div>
      <SectionLoader loading={loading} />

      {!loading && !isError && (
        <>
          {" "}
          {checkIns.length > 0 ? (
            <div className="bg-white pb-4 rounded-[10px] dark:bg-card ">
              <ul className="">
                {checkIns.map((checkIn, id) => {
                  return <CheckInHistory checkIn={checkIn} key={id} />;
                })}
              </ul>
              {hasNextPage && (
                <div className="flex justify-center mt-2">
                  {" "}
                  <MainButton
                    label="Load more"
                    loading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    color="black"
                    variant="outlined"
                    size="sm"
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <FaPersonWalking />
                </EmptyMedia>
                <EmptyTitle>No check-ins</EmptyTitle>
                <EmptyDescription>
                  Your check-ins will show up here when you start checking in to
                  the gym
                </EmptyDescription>

                <EmptyContent>
                  <Link href={NEW_CHECK_IN}>
                    <Button>Check in now</Button>
                  </Link>
                </EmptyContent>
              </EmptyHeader>
            </Empty>
          )}
        </>
      )}
    </div>
  );
};

export default CheckIns;
