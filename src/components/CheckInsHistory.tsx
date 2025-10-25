import React from "react";
import Heading from "./Heading";
import { useGetRecentCheckInsQuery } from "@/redux/api-slices/subscription.slice";
import SectionLoader from "./SectionLoader";
import moment from "moment";
import Link from "next/link";
import { CHECK_INS } from "@/constants/routes";

const CheckInsHistory = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetRecentCheckInsQuery(null);

  const loading = isLoading || isFetching;

  const checkIns = data?.data?.data || [];
  return (
    <div className="bg-white rounded-[10px]">
      <header className="p-5 pb-3 flex justify-between items-center">
        <Heading className="!mb-0">Check-in History</Heading>
        <Link className="text-[12px] text-default" href={CHECK_INS}>
          See all
        </Link>
      </header>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />
      {!loading && !isError && (
        <ul className="">
          {checkIns.map((checkIn, id) => {
            return (
              <li className=" border-t  py-3 px-5" key={id}>
                <h1 className="tracking-tight  font-medium">
                  {checkIn?.checkInType === "admin"
                    ? `You were checked in by ${
                        checkIn?.checkedInBy?.firstname || ""
                      }`
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
      )}
    </div>
  );
};

export default CheckInsHistory;
