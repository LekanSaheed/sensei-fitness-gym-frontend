import { useGetMembersPieChartDataQuery } from "@/redux/api-slices/admin.slice";
import React from "react";
import { Cell, Pie, PieChart, PieLabelRenderProps } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = +innerRadius + (+outerRadius - +innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(((percent as number) ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const DashboardPieChart = () => {
  const { isLoading, isFetching, isError, data, refetch } =
    useGetMembersPieChartDataQuery(null);

  const loading = isLoading || isFetching;

  const chartData = data?.data;

  const chart: { name: string; value: number }[] = [
    { name: "New Members (Last 7 days)", value: chartData?.newMembers || 0 },
    { name: "Members with active Sub", value: chartData?.activeMembers || 0 },
    { name: "Inactive members", value: chartData?.inactiveMembers || 0 },
  ];

  // #endregion

  return (
    <div className="bg-white border h-full p-4 rounded-[15px] ">
      <PieChart
        style={{
          width: "100%",
          maxWidth: "250px",
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
          // Corner radius is the rounded edge of each pie slice
          cornerRadius="50%"
          fill="#8884d8"
          // padding angle is the gap between each pie slice
          paddingAngle={5}
          dataKey="value"
          isAnimationActive
        >
          {chart.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Members Overview</h2>
        {chart.map((entry, index) => (
          <div key={entry.name} className="flex items-center mb-1">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-sm">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPieChart;
