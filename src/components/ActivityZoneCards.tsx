"use client";

import SectionCard from "@/components/SectionCard";
import { useGetActivityZoneSummaryQuery } from "@/redux/api-slices/admin.slice";
import { ACTIVITY_ZONES, ActivityZone, ZONE_META } from "@/types/ActivityZone";
import React, { CSSProperties, FunctionComponent } from "react";

/**
 * Zone count cards. When `onSelect` is given the cards act as zone filters.
 */
const ActivityZoneCards: FunctionComponent<{
  selected?: ActivityZone | null;
  onSelect?: (zone: ActivityZone | null) => void;
}> = ({ selected, onSelect }) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetActivityZoneSummaryQuery(null);

  const loading = isLoading || isFetching;

  const summary = data?.data;

  const thresholds = summary?.thresholds;

  const footers: Record<ActivityZone, string> = {
    active: thresholds
      ? `Checked in within ${thresholds.notActiveDays} days`
      : ZONE_META.active.description,
    not_active: thresholds
      ? `No check-in for ${thresholds.notActiveDays}+ days`
      : ZONE_META.not_active.description,
    warning: thresholds
      ? `Not seen for ${thresholds.warningDays}+ days`
      : ZONE_META.warning.description,
    danger: thresholds
      ? `No check-in for ${thresholds.dangerDays}+ days`
      : ZONE_META.danger.description,
  };

  return (
    <div className="mb-4">
      {isError && (
        <div className="text-[12px] text-rose-600 mb-2">
          Could not load activity zones.{" "}
          <button className="underline" onClick={refetch}>
            Retry
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ACTIVITY_ZONES.map((zone) => {
          const meta = ZONE_META[zone];

          const isSelected = selected === zone;

          return (
            <div
              key={zone}
              role={onSelect ? "button" : undefined}
              title={onSelect ? `Show ${meta.label} users` : undefined}
              onClick={
                onSelect ? () => onSelect(isSelected ? null : zone) : undefined
              }
              className={`rounded-xl border-t-4 transition *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs *:data-[slot=card]:h-full ${
                onSelect ? "cursor-pointer hover:opacity-90" : ""
              } ${isSelected ? "ring-2 ring-offset-2 ring-(--zone-color)" : ""}`}
              style={
                {
                  borderTopColor: meta.color,
                  "--zone-color": meta.color,
                } as CSSProperties
              }
            >
              <SectionCard
                description={`${meta.label} Users`}
                value={isError ? "-" : summary?.counts?.[zone] ?? 0}
                loading={loading}
                footer={
                  <span className="text-[11px] text-gray-500 font-normal">
                    {footers[zone]}
                  </span>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityZoneCards;
