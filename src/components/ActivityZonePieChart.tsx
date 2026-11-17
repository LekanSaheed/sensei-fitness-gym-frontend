import { useGetActivityZoneSummaryQuery } from "@/redux/api-slices/admin.slice";
import { ACTIVITY_ZONES, ZONE_META } from "@/types/ActivityZone";
import React from "react";
import { Cell, Pie, PieChart } from "recharts";
import SectionLoader from "./SectionLoader";

const ActivityZonePieChart = () => {
  const { isLoading, isFetching, isError, data, refetch } =
    useGetActivityZoneSummaryQuery(null);

  const loading = isLoading || isFetching;

  const summary = data?.data;

  const chart = ACTIVITY_ZONES.map((zone) => ({
    zone,
    name: ZONE_META[zone].label,
    value: summary?.counts?.[zone] || 0,
  }));

  const total = summary?.total || 0;

  const pct = (value: number) =>
    total ? `${((value / total) * 100).toFixed(0)}%` : "0%";

  return (
    <div className="bg-white border h-full p-4 rounded-[15px]">
      <h2 className="text-lg font-semibold mb-2">Activity Breakdown</h2>

      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!loading && !isError && total === 0 && (
        <div className="text-[13px] text-gray-500 py-6 text-center">
          No members to classify yet
        </div>
      )}

      {!loading && !isError && total > 0 && (
        <>
          <PieChart
            style={{
              width: "100%",
              maxWidth: "200px",
              maxHeight: "80vh",
              aspectRatio: 1,
              marginLeft: "auto",
              marginRight: "auto",
            }}
            responsive
          >
            <Pie
              data={chart}
              innerRadius="80%"
              outerRadius="100%"
              cornerRadius="50%"
              paddingAngle={5}
              dataKey="value"
              isAnimationActive
            >
              {chart.map((entry) => (
                <Cell key={entry.zone} fill={ZONE_META[entry.zone].color} />
              ))}
            </Pie>
          </PieChart>

          <div className="mt-4">
            {chart.map((entry) => (
              <div key={entry.zone} className="flex items-center mb-3">
                <div
                  className="w-[20px] rounded-[6px] h-4 mr-2 shrink-0"
                  style={{ backgroundColor: ZONE_META[entry.zone].color }}
                />
                <span className="text-[13px]">
                  {entry.name}: {entry.value}{" "}
                  <span className="text-gray-500">({pct(entry.value)})</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityZonePieChart;
