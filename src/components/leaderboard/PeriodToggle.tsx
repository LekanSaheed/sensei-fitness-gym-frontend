import { LeaderboardPeriod } from "@/types/Leaderboard";
import React from "react";

const OPTIONS: { value: LeaderboardPeriod; label: string }[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

/** Weekly / monthly switch for a leaderboard */
const PeriodToggle = ({
  value,
  onChange,
  tone = "dark",
}: {
  value: LeaderboardPeriod;
  onChange: (p: LeaderboardPeriod) => void;
  tone?: "dark" | "light";
}) => (
  <div
    role="tablist"
    aria-label="Leaderboard period"
    className={`inline-flex rounded-full p-1 ${
      tone === "dark" ? "bg-white/10" : "bg-gray-100 border border-gray-200"
    }`}
  >
    {OPTIONS.map((o) => {
      const active = o.value === value;

      return (
        <button
          key={o.value}
          role="tab"
          aria-selected={active}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${
            active
              ? "bg-default text-white shadow-sm"
              : tone === "dark"
              ? "text-white/70 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

export default PeriodToggle;
