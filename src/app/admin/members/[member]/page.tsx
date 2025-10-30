"use client";

import SectionLoader from "@/components/SectionLoader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useGetCheckInsQuery,
  useGetMemberByIdQuery,
} from "@/redux/api-slices/admin.slice";
import { SubscriptionStatus } from "@/redux/api-slices/subscription.slice";
import { collocateMemberName, getInitials } from "@/utils";
import moment from "moment";
import { useParams } from "next/navigation";
import React from "react";

const Member = () => {
  const { member } = useParams() as { member: string };

  const { data, isLoading, isFetching, refetch, isError } =
    useGetMemberByIdQuery({ id: member, includeSub: true });

  const loading = isLoading || isFetching;

  const memberDetails = data?.data || null;

  const subscription = memberDetails?.latestSubscription || null;

  const daysLeft = moment(subscription?.endDate).diff(moment(), "days");

  const statusClass: Record<SubscriptionStatus, string> = {
    expired: "bg-rose-500",
    canceled: "bg-gray-500",
    active: "bg-emerald-500",
  };

  const getCheckIn = useGetCheckInsQuery({ userId: member, page: 1, limit: 1 });

  const checkInLoading = getCheckIn.isLoading || getCheckIn.isFetching;

  const lastCheckIn = (getCheckIn?.data?.data?.data || [])[0];
  return (
    <div>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!loading && !isError && memberDetails && (
        <div className="">
          <div className="border-b font-jakarta flex items-center gap-2 py-4">
            <Avatar className="size-20 text-[25px]">
              <AvatarFallback>
                {getInitials(collocateMemberName(memberDetails))}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-[20px] leading-[100%]">
                {memberDetails?.firstname || ""} {memberDetails?.lastname || ""}
              </h1>
              <p className="text-[14px] text-default">
                @{memberDetails?.username}
              </p>
              <p className="text-[12px] text-gray-500">
                {memberDetails?.email}
              </p>
            </div>
          </div>
          <div className="py-4 border-b">
            <h1 className="text-[12px] text-gray-800 font-bold">
              Recent Subscription
            </h1>

            {subscription ? (
              <div className="p-4 border mt-2 rounded-[10px]">
                <h1 className="font-bold font-jakarta text-[14px] mb-1">
                  {subscription?.planNameSnapshot}
                  <span className="inline-flex items-center font-normal  ml-2 text-gray-600">
                    <span
                      className={`size-[6px] inline-block rounded-full mr-0.5 shrink-0 ${
                        statusClass[subscription?.status]
                      }`}
                    />
                    <span className="">{subscription.status}</span>
                  </span>
                </h1>
                {subscription?.includesTrainer && (
                  <p className="text-default border-default inline-block text-[12px] px-2 py-0.5 font-normal mb-2 border rounded-[4px]">
                    Includes Trainer
                  </p>
                )}
                <p className="text-[12px] text-gray-500">
                  Valid for {subscription?.planDurationInDaysSnapshot} day
                  {subscription?.planDurationInDaysSnapshot > 1
                    ? "s"
                    : ""} -{" "}
                  <span className="text-[12px] text-black font-medium">
                    {daysLeft > 0 ? daysLeft : 0} day{daysLeft > 1 ? "s" : ""}{" "}
                    left
                  </span>
                </p>
              </div>
            ) : (
              <div className="font-light text-[13px] py-3">
                User has not subscribed to any plan yet
              </div>
            )}
          </div>
          <div className="py-4">
            <h1 className="text-[12px] text-gray-800 font-bold">
              Last Check-In
            </h1>
            {lastCheckIn && !checkInLoading && !getCheckIn.isError && (
              <div className="p-4 border mt-2 rounded-[10px] text-[14px]">
                {lastCheckIn?.checkInType === "admin"
                  ? `Checked in by ${
                      lastCheckIn?.checkedInBy?.firstname || ""
                    } ${lastCheckIn?.checkedInBy?.lastname || ""}, ${moment(
                      lastCheckIn?.createdAt
                    ).calendar()}`
                  : `Checked in ${moment(lastCheckIn?.createdAt).calendar()}`}
              </div>
            )}
            {!lastCheckIn && !checkInLoading && !getCheckIn.isError && (
              <div>This member has no check ins</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
