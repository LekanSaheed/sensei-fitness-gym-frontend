import { ActivityZone, ZONE_META } from "@/types/ActivityZone";
import React, { FunctionComponent } from "react";

const ActivityZoneBadge: FunctionComponent<{
  zone?: ActivityZone | null;
  className?: string;
}> = ({ zone, className }) => {
  const meta = ZONE_META[zone || "active"] || ZONE_META.active;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-[5px] text-[12px] font-medium whitespace-nowrap ${
        meta.badge
      } ${className || ""}`}
    >
      <span className={`size-[6px] rounded-full shrink-0 ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

export default ActivityZoneBadge;
