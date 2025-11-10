import { useGetRevenueChartDataQuery } from "@/redux/api-slices/admin.slice";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Select, { SelectDropdownOption } from "./select";
import SelectInput, { DropdownOption } from "./select-input";
import { usePaginationProps } from "@/hooks/usePaginate";
import moment from "moment";
import FormatNumber from "@/utils/format-number";

interface DataPoint {
  time: string;
  amt: number;
}
// #region Sample data

const filters: DropdownOption[] = [
  // { label: "Today", value: "today" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
];

// #endregion
export default function DashboardAreaChart() {
  const { preset } = usePaginationProps();

  const { data, isLoading, isFetching } = useGetRevenueChartDataQuery({
    preset: preset || "thisMonth",
  });

  const stats = data?.data?.data || [];

  const total = data?.data?.totalRevenue || 0;

  const loading = isLoading || isFetching;

  const selected = filters.find((f) => f.value === preset) || filters[2];

  const formattedData: DataPoint[] = stats.map((stat) => ({
    time: loading
      ? "..."
      : moment(stat.label).format(
          preset === "thisYear" || preset === "lastYear" ? "MMM" : "DD MMM"
        ),
    amt: stat.total,
  }));

  // const chartDataMap: Record<'today' | 'last7days' | 'last30days', DataPoint[]> = {
  //   today:
  // }
  return (
    <div className="bg-white border p-4 rounded-[15px]">
      <div className="flex justify-between  mb-4">
        <div>
          <h1 className="text-gray-500 text-[14px]">
            Total Revenue for{" "}
            <span className="lowercase">{selected?.label}</span>
          </h1>
          <p className="text-[30px] font-semibold text-default-secondary tracking-tighter">
            {loading ? "..." : FormatNumber.ngnAmount(total)}
          </p>
        </div>
        <div>
          <SelectInput
            selected={selected}
            options={filters}
            queryKey="preset"
          />
        </div>
      </div>
      <LineChart
        style={{
          width: "100%",

          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={formattedData}
        margin={{
          top: 15,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="2 2" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{
            fill: "#999999",
            fontSize: 12,
            letterSpacing: "-0.32px",
            fontWeight: "600",
          }}
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis
          width="auto"
          tickFormatter={(value) => FormatNumber.ngnAmount(value)}
          tickLine={false}
          axisLine={{
            stroke: "var(--color-default-tertiary)",
            strokeDasharray: "2 2",
          }}
          tick={{ fill: "#999999", fontSize: 12, letterSpacing: "-0.32px" }}
        />
        <Tooltip
          cursor={{
            strokeWidth: 1.32,
            fill: "#EEEEEE",
            strokeDasharray: "5 5",
          }}
          labelFormatter={(label, payload) => {
            return `Date: ${label}`;
          }}
          formatter={(value, name, props) => {
            return [`${FormatNumber.ngnAmount(+value)}`, "Revenue"];
          }}
        />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="amt"
          stroke="var(--color-default)"
          strokeWidth={3}
          activeDot={{ r: 6, strokeWidth: 2.65 }}
          dot={false}
        />
      </LineChart>
    </div>
  );
}
