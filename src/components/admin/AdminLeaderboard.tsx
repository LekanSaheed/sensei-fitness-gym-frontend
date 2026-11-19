"use client";

import LeaderAvatar from "@/components/leaderboard/LeaderAvatar";
import PeriodToggle from "@/components/leaderboard/PeriodToggle";
import Podium from "@/components/leaderboard/Podium";
import SectionLoader from "@/components/SectionLoader";
import { MEMBERS } from "@/constants/routes";
import { useGetAdminLeaderboardQuery } from "@/redux/api-slices/admin.slice";
import { LeaderboardEntry, LeaderboardPeriod } from "@/types/Leaderboard";
import { Cup, Ranking } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { ordinal } from "@/utils/ordinal";

const memberLink = (entry: LeaderboardEntry, children: ReactNode) =>
  entry._id ? (
    <Link href={`${MEMBERS}/${entry._id}`} className="hover:text-default hover:underline">
      {children}
    </Link>
  ) : (
    children
  );

/** Admin dashboard: the most consistent members this week / month */
const AdminLeaderboard = () => {
  const [period, setPeriod] = useState<LeaderboardPeriod>("week");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminLeaderboardQuery({ period });

  const board = data?.data;

  const entries = board?.entries || [];

  const rest = entries.filter((e) => e.rank > 3);

  const leaderCount = entries[0]?.checkIns || 1;

  const totalCheckIns = entries.reduce((sum, e) => sum + e.checkIns, 0);

  return (
    <section className="rounded-[18px] bg-white border border-gray-200/80 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-bold text-[16px] tracking-tight flex items-center gap-2">
            <Cup size={18} color="var(--color-default)" variant="Bold" />
            Check-in Leaderboard
          </h2>
          <p className="text-[12px] text-gray-500">
            {board
              ? `${
                  board.start && board.end
                    ? `${moment(board.start).format("D MMM")} – ${moment(board.end).format("D MMM YYYY")}`
                    : "All time"
                } · top ${board.size} members by check-ins`
              : "Top members by check-ins"}
          </p>
        </div>
        <PeriodToggle value={period} onChange={setPeriod} tone="light" />
      </div>

      <SectionLoader loading={isLoading} error={isError} refetch={refetch} />

      {!isLoading && !isError && entries.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-gray-300 p-8 text-center">
          <Ranking size={28} color="var(--color-default)" variant="Bulk" className="mx-auto mb-2" />
          <p className="font-semibold text-[14px]">
            No member check-ins{" "}
            {period === "week" ? "this week" : period === "month" ? "this month" : ""} yet
          </p>
        </div>
      )}

      {!isLoading && !isError && entries.length > 0 && (
        <div
          className={`grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 transition ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          <div>
            <div className="rounded-[16px] bg-gradient-to-b from-default/[0.07] to-transparent px-3 pt-10">
              <Podium entries={entries} tone="light" renderName={memberLink} />
            </div>
            <dl className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-[12px] bg-gray-50 border border-gray-200/80 px-3 py-2.5">
                <dt className="text-[11px] text-gray-500">Members on the board</dt>
                <dd className="text-[18px] font-bold tabular-nums">{entries.length}</dd>
              </div>
              <div className="rounded-[12px] bg-gray-50 border border-gray-200/80 px-3 py-2.5">
                <dt className="text-[11px] text-gray-500">Their check-ins</dt>
                <dd className="text-[18px] font-bold tabular-nums">{totalCheckIns}</dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-gray-500 px-3 pb-2 border-b">
              <span>Rank &amp; member</span>
              <span>Check-ins</span>
            </div>
            {rest.length === 0 ? (
              <p className="text-[13px] text-gray-500 text-center py-8">
                Only {entries.length} member{entries.length === 1 ? "" : "s"} on the board so far.
              </p>
            ) : (
              <ol className="max-h-[440px] overflow-y-auto divide-y [scrollbar-width:thin]">
                {rest.map((entry) => (
                  <li key={entry.rank} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50">
                    <span className="w-9 text-[13px] font-semibold text-gray-500 tabular-nums">
                      {ordinal(entry.rank)}
                    </span>
                    <LeaderAvatar
                      name={entry.name}
                      image={entry.image}
                      className="size-8"
                      fallbackClassName="text-[11px]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">
                        {memberLink(entry, entry.name)}
                      </p>
                      <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-default/70"
                          style={{ width: `${Math.max(6, (entry.checkIns / leaderCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[13px] font-bold tabular-nums w-8 text-right">
                      {entry.checkIns}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminLeaderboard;
