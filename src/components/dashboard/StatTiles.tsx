"use client";

import useWeekCheckIns from "@/hooks/useWeekCheckIns";
import { useGetCheckInAnalyticsQuery } from "@/redux/api-slices/subscription.slice";
import { Calendar, Flash, Icon, MedalStar } from "iconsax-react";
import React from "react";

const StatTiles = () => {
  const { weekCount, monthCount, loading } = useWeekCheckIns();

  const analytics = useGetCheckInAnalyticsQuery(null);

  const tiles: { label: string; value: number; icon: Icon; loading: boolean }[] =
    [
      { label: "This week", value: weekCount, icon: Flash, loading },
      { label: "This month", value: monthCount, icon: Calendar, loading },
      {
        label: "All time",
        value: analytics.data?.data?.totalCheckIns || 0,
        icon: MedalStar,
        loading: analytics.isLoading,
      },
    ];

  return (
    <section className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-[18px] bg-white dark:bg-card p-3.5 sm:p-4 border border-gray-200/70 dark:border-border"
        >
          <span className="size-8 rounded-full bg-default/10 inline-flex items-center justify-center mb-2">
            {React.createElement(tile.icon, {
              size: 16,
              color: "var(--color-default)",
              variant: "Bold",
            })}
          </span>
          {tile.loading ? (
            <div className="h-[30px] w-[50%] rounded-[8px] bg-gray-500/20 animate-pulse" />
          ) : (
            <p className="font-league text-[36px] leading-none">{tile.value}</p>
          )}
          <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-muted-foreground mt-1">
            {tile.label}
            <span className="sr-only"> check-ins</span>
          </p>
        </div>
      ))}
    </section>
  );
};

export default StatTiles;
