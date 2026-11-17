"use client";

import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { CHECK_INS, DASHBOARD } from "@/constants/routes";
import {
  useCheckIfCheckedInTodayQuery,
  useCheckInMutation,
  useGetCheckInLocationRequirementQuery,
} from "@/redux/api-slices/subscription.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { LocationTick, TickCircle } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { getDeviceLocation, LocationError } from "@/utils/geolocation";

const CheckIn = () => {
  const [checkIn, checkInStatus] = useCheckInMutation();

  const { isError, isLoading, isFetching, refetch, data } =
    useCheckIfCheckedInTodayQuery(null);

  const loading = isLoading || isFetching;

  const canCheckIn = !loading && !isError && !data?.data?.checkedIn;

  const router = useRouter();

  const requirement = useGetCheckInLocationRequirementQuery(null);

  const needsLocation = !!requirement.data?.data?.required;

  const [locating, setLocating] = useState(false);

  const checkInForToday = async () => {
    let location = null;

    if (needsLocation) {
      setLocating(true);

      try {
        location = await getDeviceLocation();
      } catch (err) {
        toast.error(
          err instanceof LocationError ? err.message : DEFAULT_ERROR_MESSAGE,
          { duration: 6000 }
        );

        return;
      } finally {
        setLocating(false);
      }
    }

    const res = await checkIn(location ? { location } : null);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE, { duration: 6000 });
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
    <div className="pt-2">
      <SectionLoader
        loading={loading && !checkInStatus.isLoading}
        error={isError}
        refetch={refetch}
      />

      {canCheckIn && (
        <section className="relative overflow-hidden sm:max-w-[440px] mx-auto rounded-[28px] bg-default-black text-white px-6 pt-8 pb-6 text-center dark:border dark:border-border">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 size-64 rounded-full bg-default/30 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.2em] text-default-tertiary">
              {moment().format("dddd, D MMMM")}
            </p>
            <h1 className="font-league uppercase text-[40px] leading-none mt-2">
              Ready to train?
            </h1>
            <p className="text-[13px] text-white/70 mt-2">
              Tap the button to check in for today&apos;s session.
            </p>
            {needsLocation && (
              <p className="text-[12px] text-white/50 mt-2">
                You need to be at the gym. We&apos;ll ask for your location
                once, only to confirm that; you&apos;re not tracked.
              </p>
            )}

            <div className="my-8 flex justify-center">
              <button
                onClick={checkInForToday}
                disabled={checkInStatus.isLoading || locating}
                aria-label="Check in for today"
                className="group relative size-[180px] rounded-full bg-default text-white flex flex-col items-center justify-center gap-2 shadow-[0_18px_45px_-12px_var(--color-default)] transition active:scale-95 disabled:opacity-80"
              >
                <span className="absolute inset-0 rounded-full border-2 border-default animate-ping opacity-30" />
                <span className="absolute -inset-3 rounded-full border border-default/30" />
                {checkInStatus.isLoading || locating ? (
                  <span className="text-[36px]">
                    <Spinner className="text-white" />
                  </span>
                ) : (
                  <>
                    <LocationTick size={48} color="currentColor" variant="Bold" />
                    <span className="font-league uppercase text-[26px] leading-none">
                      Check in
                    </span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => router.replace(DASHBOARD)}
              className="text-[13px] text-white/70 underline-offset-4 hover:underline"
            >
              No, go back
            </button>
          </div>
        </section>
      )}

      {isCheckedIn && !loading && !isError && (
        <section className="sm:max-w-[440px] mx-auto">
          <div className="rounded-[28px] bg-white border border-gray-200/70 p-8 text-center dark:bg-card dark:text-card-foreground dark:border-border">
            <div className="relative mx-auto mb-5 size-[120px]">
              <span className="absolute inset-0 rounded-full bg-emerald-500/10" />
              <span className="absolute inset-3 rounded-full bg-emerald-500/15" />
              <TickCircle
                size={72}
                color="var(--color-emerald-500)"
                variant="Bold"
                className="absolute inset-0 m-auto"
              />
            </div>
            <h1 className="font-league uppercase text-[34px] leading-none mb-3">
              You&apos;re checked in
            </h1>
            <p className="text-[14px] text-gray-500 dark:text-gray-400">
              {"You’re"} checked in for today! Have a productive and enjoyable
              workout session. Remember to stay hydrated and show respect to
              fellow members.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              href={DASHBOARD}
              className="rounded-full bg-default px-4 py-3 text-center text-[14px] font-semibold text-white transition active:scale-[0.97]"
            >
              Go to dashboard
            </Link>
            <Link
              href={CHECK_INS}
              className="rounded-full border border-default px-4 py-3 text-center text-[14px] font-semibold text-default transition active:scale-[0.97]"
            >
              View training log
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default CheckIn;
