import React from "react";
import Heading from "./Heading";
import { useGetRecentCheckInsQuery } from "@/redux/api-slices/subscription.slice";
import SectionLoader from "./SectionLoader";
import moment from "moment";
import Link from "next/link";
import { CHECK_INS } from "@/constants/routes";
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

const CheckInsHistory = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetRecentCheckInsQuery(null);

  const loading = isLoading || isFetching;

  const checkIns = data?.data?.data || [];

  const noCheckIn = checkIns.length < 1 && !loading && !isError;
  return (
    <div className="bg-white rounded-[10px]">
      <header className="p-5 pb-3 flex justify-between items-center">
        <Heading className="!mb-0">Check-in History</Heading>
        <Link className="text-[12px] text-default" href={CHECK_INS}>
          See all
        </Link>
      </header>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!noCheckIn ? (
        <ul className="">
          {checkIns.map((checkIn, id) => {
            return (
              <li className=" border-t  py-3 px-5" key={id}>
                <h1 className="  font-medium">
                  {checkIn?.checkInType === "admin"
                    ? `You were checked in by ${
                        checkIn?.checkedInBy?.firstname || ""
                      },`
                    : "You checked in"}{" "}
                  {moment(checkIn.createdAt).fromNow()} at{" "}
                  {moment(checkIn.createdAt).format("hh:mm a")}
                </h1>
                <p className="text-[12px] text-gray-400">
                  {moment(checkIn?.createdAt).format("llll")} -{" "}
                  <span className="capitalize">{checkIn?.checkInType}</span>
                </p>
              </li>
            );
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
              Your check-ins will show up here when you start checking in to the
              gym
            </EmptyDescription>

            <EmptyContent>
              <Link href={CHECK_INS}>
                <Button>Check in now</Button>
              </Link>
            </EmptyContent>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
};

export default CheckInsHistory;
