import useUser from "@/hooks/useUser";
import { useCheckIfCheckedInTodayQuery } from "@/redux/api-slices/subscription.slice";
import { Star, StarSlash } from "iconsax-react";
import React from "react";

const CheckInNotifier = () => {
  const { isError, isLoading, isFetching, data } =
    useCheckIfCheckedInTodayQuery(null);

  const loading = isFetching || isLoading;

  const hasCheckedIn = data?.data?.checkedIn;

  const user = useUser();

  if (loading || isError) return <></>;

  return (
    <div className="mt-4 bg-white flex items-center gap-2 p-4 rounded-[10px] border border-gray-300/50 dark:bg-secondary dark:border-sidebar">
      {React.createElement(hasCheckedIn ? Star : StarSlash, {
        size: 24,
        color: "var(--color-default)",
        variant: "Bulk",
      })}
      <p className="font-semibold text-gray-900 dark:text-secondary-foreground">
        {user?.firstname},{" "}
        {hasCheckedIn
          ? "you've checked in for today"
          : "you've not checked in today"}
      </p>
    </div>
  );
};

export default CheckInNotifier;
