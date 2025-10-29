"use client";

import Button from "@/components/button";
import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { DASHBOARD } from "@/constants/routes";
import {
  useCheckIfCheckedInTodayQuery,
  useCheckInMutation,
} from "@/redux/api-slices/subscription.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { TickCircle } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const CheckIn = () => {
  const [checkIn, checkInStatus] = useCheckInMutation();

  const { isError, isLoading, isFetching, refetch, data } =
    useCheckIfCheckedInTodayQuery(null);

  const loading = isLoading || isFetching;

  const canCheckIn = !loading && !isError && !data?.data?.checkedIn;

  const router = useRouter();

  const checkInForToday = async () => {
    const res = await checkIn(null);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(
          response?.message || "You have successfully checked in for today"
        );
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  const isCheckedIn = data?.data?.checkedIn;

  return (
    <div>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {canCheckIn && (
        <div className="sm:max-w-[400px] mx-auto bg-white p-6 rounded-[10px] dark:bg-card">
          <div className="text-center mb-4">
            <h1 className="font-black text-[23px]">Check In</h1>
            <p className="text-center  text-gray-500">
              Are you ready to check in for today?
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.replace(DASHBOARD)}
              label="No, go back"
              variant="outlined"
              color="black"
              fullWidth
              size="lg"
            />
            <Button
              label="Check in"
              fullWidth
              size="lg"
              loading={checkInStatus.isLoading}
              onClick={checkInForToday}
            />
          </div>
        </div>
      )}

      {isCheckedIn && !loading && !isError && (
        <div className="sm:max-w-[400px] mx-auto">
          <div className="bg-white p-6 rounded-[10px] dark:bg-card dark:text-card-foreground">
            <TickCircle size={80} color="green" className="mx-auto mb-4" />
            <h1 className="text-center text-[25px] mb-2 font-bold">
              You have checked in
            </h1>
            <p className="text-[14px] text-center text-gray-500 dark:text-gray-400">
              {"You’re"} checked in for today! Have a productive and enjoyable
              workout session. Remember to stay hydrated and show respect to
              fellow members.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href={DASHBOARD} className="mt-4 ">
              <Button size="lg" label="Go to dashboard" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;
