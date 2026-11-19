"use client";

import { useGetRevenueChartDataQuery } from "@/redux/api-slices/admin.slice";
import FormatNumber from "@/utils/format-number";
import { ArrowDown, ArrowUp, Chart21 } from "iconsax-react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTHS = moment.monthsShort();

const short = (n: number) =>
  n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`
    : n >= 1000
    ? `₦${Math.round(n / 1000)}k`
    : `₦${n}`;

type Point = { label: string; total: number; count: number; tick: string; full: string };

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
}) => {
  if (!active || !payload?.length) return null;

  const p = payload[0].payload;

  return (
    <div className="rounded-[12px] bg-default-black text-white px-3 py-2 shadow-xl">
      <p className="text-[11px] text-white/60">{p.full}</p>
      <p className="text-[15px] font-bold">{FormatNumber.ngnAmount(p.total)}</p>
      <p className="text-[11px] text-white/60">
        {p.count} payment{p.count === 1 ? "" : "s"}
      </p>
    </div>
  );
};

/**
 * Admin dashboard revenue: this week, any month, or a whole year.
 * The view lives in the URL (revView / revYear / revMonth) so it survives
 * reloads. In the year view, clicking a month's bar opens that month.
 */
export default function DashboardAreaChart() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const pathname = usePathname();

  const now = moment();

  const isWeek = searchParams.get("revView") === "week";

  const year = Number(searchParams.get("revYear")) || now.year();

  // Default: the current month. "0" means the whole year.
  const monthParam = searchParams.get("revMonth");

  const month = monthParam === null ? now.month() + 1 : Number(monthParam) || 0;

  const { data, isLoading, isFetching, isError, refetch } =
    useGetRevenueChartDataQuery(isWeek ? { view: "week" } : { year, month });

  const chart = data?.data;

  const monthsRef = useRef<HTMLDivElement>(null);

  // Keep the selected month chip visible in the scrolling row
  useEffect(() => {
    const row = monthsRef.current;

    const active = row?.querySelector<HTMLElement>('[aria-selected="true"]');

    if (row && active) {
      row.scrollTo({
        left: active.offsetLeft - row.clientWidth / 2 + active.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [month, year, isWeek]);

  const setView = (next: { week?: boolean; year?: number; month?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.week) {
      params.set("revView", "week");
    } else {
      params.delete("revView");
      params.set("revYear", String(next.year ?? year));
      params.set("revMonth", String(next.month ?? month));
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const points: Point[] = useMemo(
    () =>
      (chart?.data || []).map((d) => {
        const m = moment(d.label, chart?.unit === "day" ? "YYYY-MM-DD" : "YYYY-MM");

        return {
          ...d,
          tick: chart?.unit === "day" ? (chart.view === "week" ? m.format("ddd") : m.format("D")) : m.format("MMM"),
          full: chart?.unit === "day" ? m.format("dddd, D MMM YYYY") : m.format("MMMM YYYY"),
        };
      }),
    [chart]
  );

  const best = points.reduce<Point | null>((b, p) => (p.total > (b?.total || 0) ? p : b), null);

  const total = chart?.totalRevenue || 0;

  const previous = chart?.previousTotal || 0;

  const change = previous > 0 ? ((total - previous) / previous) * 100 : null;

  const periodLabel = isWeek
    ? "This week"
    : month
    ? moment({ year, month: month - 1 }).format("MMMM YYYY")
    : `${year}`;

  const previousLabel = isWeek ? "last week" : month ? "the month before" : "the year before";

  const years = chart?.years?.length ? chart.years : [now.year()];

  const loading = isLoading || isFetching;

  const yearView = chart?.unit === "month";

  return (
    <section className="bg-white border border-gray-200/80 rounded-[18px] p-4 md:p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)]">
      {/* Header: total, change, controls */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Chart21 size={14} color="var(--color-default)" variant="Bold" />
            Revenue · {periodLabel}
          </p>
          <p className="text-[30px] md:text-[34px] font-black tracking-tight text-default-secondary leading-tight mt-1 tabular-nums">
            {isLoading ? (
              <span className="inline-block h-[34px] w-[180px] rounded-[8px] bg-gray-100 animate-pulse align-middle" />
            ) : (
              FormatNumber.ngnAmount(total)
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[12px] text-gray-500">
            {change !== null && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
                  change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                }`}
              >
                {change >= 0 ? <ArrowUp size={12} color="currentColor" /> : <ArrowDown size={12} color="currentColor" />}
                {Math.abs(change).toFixed(change !== 0 && Math.abs(change) < 10 ? 1 : 0)}%
              </span>
            )}
            <span>
              {change !== null
                ? `vs ${previousLabel} (${FormatNumber.ngnAmount(previous)})`
                : previous === 0 && total > 0
                ? `Nothing in ${previousLabel}`
                : ""}
            </span>
            <span className="text-gray-300">•</span>
            <span>
              {chart?.transactions ?? 0} payment{chart?.transactions === 1 ? "" : "s"}
            </span>
            {best && best.total > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span>
                  Best {yearView ? "month" : "day"}: <b className="text-gray-700">{yearView ? best.tick : moment(best.label).format("D MMM")}</b>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView({ week: true })}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold border transition ${
              isWeek ? "bg-default border-default text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            This week
          </button>
          <label className="sr-only" htmlFor="revenue-year">Year</label>
          <select
            id="revenue-year"
            value={year}
            onChange={(e) => setView({ year: Number(e.target.value) })}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-4 focus:ring-default/20"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Month picker for the selected year */}
      <div ref={monthsRef} className="relative mt-4 -mx-1 px-1 overflow-x-auto [scrollbar-width:none]">
        <div role="tablist" aria-label={`Months of ${year}`} className="flex gap-1.5 min-w-max">
          <button
            role="tab"
            aria-selected={!isWeek && month === 0}
            onClick={() => setView({ month: 0 })}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
              !isWeek && month === 0 ? "bg-default-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Whole year
          </button>
          {MONTHS.map((label, i) => {
            const m = i + 1;

            const future = year > now.year() || (year === now.year() && m > now.month() + 1);

            const active = !isWeek && month === m;

            return (
              <button
                key={label}
                role="tab"
                aria-selected={active}
                disabled={future}
                onClick={() => setView({ month: m })}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition disabled:opacity-35 disabled:cursor-not-allowed ${
                  active ? "bg-default text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className={`mt-5 h-[260px] md:h-[300px] transition ${loading ? "opacity-50" : ""}`}>
        {isError ? (
          <div className="h-full flex flex-col items-center justify-center text-[13px] text-gray-500 gap-2">
            We couldn&apos;t load revenue.
            <button onClick={refetch} className="rounded-full bg-default-black text-white px-4 py-1.5 text-[12px] font-semibold">
              Retry
            </button>
          </div>
        ) : yearView ? (
          <BarChart
            responsive
            style={{ width: "100%", height: "100%" }}
            data={points}
            margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            onClick={(e) => {
              const i = Number(e?.activeTooltipIndex);

              if (!isNaN(i) && points[i]) setView({ month: i + 1 });
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="tick" axisLine={false} tickLine={false} tick={{ fill: "#999", fontSize: 12 }} dy={6} />
            <YAxis width={52} axisLine={false} tickLine={false} tick={{ fill: "#999", fontSize: 11 }} tickFormatter={short} />
            <Tooltip cursor={{ fill: "rgb(0 0 0 / 0.04)", radius: 8 }} content={<ChartTooltip />} />
            <Bar dataKey="total" radius={[8, 8, 3, 3]} maxBarSize={38} className="cursor-pointer">
              {points.map((p) => (
                <Cell
                  key={p.label}
                  fill={p.label === best?.label ? "var(--color-default)" : "color-mix(in srgb, var(--color-default) 45%, white)"}
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <AreaChart
            responsive
            style={{ width: "100%", height: "100%" }}
            data={points}
            margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-default)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-default)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis
              dataKey="tick"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#999", fontSize: 12 }}
              dy={6}
              interval={isWeek ? 0 : "preserveStartEnd"}
              minTickGap={8}
            />
            <YAxis width={52} axisLine={false} tickLine={false} tick={{ fill: "#999", fontSize: 11 }} tickFormatter={short} />
            <Tooltip cursor={{ stroke: "var(--color-default)", strokeDasharray: "4 4" }} content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-default)"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: "white" }}
            />
          </AreaChart>
        )}
      </div>
      {yearView && !isError && (
        <p className="text-[11px] text-gray-400 mt-1 text-right">Click a month to see its days</p>
      )}
    </section>
  );
}
