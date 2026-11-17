import React from "react";
import Heading from "./Heading";
import { useGetRecentCheckInsQuery } from "@/redux/api-slices/subscription.slice";
import SectionLoader from "./SectionLoader";
import moment from "moment";
import Link from "next/link";
import { CHECK_INS, NEW_CHECK_IN } from "@/constants/routes";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Button } from "./ui/button";
import { FaPersonWalking } from "react-icons/fa6";
import { ICheckIn } from "@/types";
import { SecurityUser } from "iconsax-react";

const CheckInsHistory = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetRecentCheckInsQuery(null);

  const loading = isLoading || isFetching;

  const checkIns = data?.data?.data || [];

  const noCheckIn = checkIns.length < 1;
  return (
    <div className="bg-white rounded-[10px] dark:bg-card">
      <header className="p-5 pb-3 flex justify-between items-center">
        <Heading className="!mb-0">Check-in History</Heading>
        <Link className="text-[12px] text-default" href={CHECK_INS}>
          See all
        </Link>
      </header>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!loading && !isError && (
        <>
          {" "}
          {!noCheckIn ? (
            <ul className="">
              {checkIns.map((checkIn, id) => {
                return <CheckInHistory checkIn={checkIn} key={id} />;
              })}
            </ul>
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

export const CheckInHistory = ({ checkIn }: { checkIn: ICheckIn }) => {
  const isAdmin = checkIn?.checkInType === "admin";

  const date = moment(checkIn?.createdAt);

  return (
    <li className="flex items-center gap-3 p-3 dark:text-card-foreground">
      <div className="w-[52px] h-[56px] shrink-0 rounded-[14px] bg-default/10 border border-default/20 flex flex-col items-center justify-center">
        <span className="font-league text-[26px] leading-none text-default">
          {date.format("DD")}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-muted-foreground">
          {date.format("ddd")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold tracking-tight text-[14px] truncate">
          {isAdmin
            ? `Checked in by ${checkIn?.checkedInBy?.firstname || "staff"}`
            : "Self check-in"}
        </h3>
        <p className="text-[12px] text-gray-500 dark:text-muted-foreground">
          {date.format("hh:mm a")} · {date.fromNow()}
        </p>
      </div>
      <span
        title={isAdmin ? "Checked in by staff" : "Self check-in"}
        className="size-9 shrink-0 rounded-full bg-default inline-flex items-center justify-center"
      >
        {React.createElement(isAdmin ? SecurityUser : FaPersonWalking, {
          size: 16,
          color: "var(--color-white)",
          variant: "Bold",
        })}
      </span>
    </li>
  );
};

export default CheckInsHistory;
