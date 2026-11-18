"use client";

import LeaderAvatar from "@/components/leaderboard/LeaderAvatar";
import PeriodToggle from "@/components/leaderboard/PeriodToggle";
import Podium from "@/components/leaderboard/Podium";
import { useGetLeaderboardQuery } from "@/redux/api-slices/subscription.slice";
import { LeaderboardPeriod } from "@/types/Leaderboard";
import { Cup, Ranking } from "iconsax-react";
import moment from "moment";
import React, { useState } from "react";

/** Member dashboard: who has checked in the most this week / month */
const Leaderboard = () => {
  const [period, setPeriod] = useState<LeaderboardPeriod>("week");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetLeaderboardQuery({ period });

  const board = data?.data;

  const entries = board?.entries || [];

  const rest = entries.filter((e) => e.rank > 3);

  const periodWord = period === "week" ? "week" : "month";

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-default-black text-white p-5 shadow-sm dark:border dark:border-border">
      <div className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-default/25 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-default-tertiary flex items-center gap-1.5">
              <Cup size={14} color="currentColor" variant="Bold" />
              Leaderboard
            </p>
            <h2 className="font-league uppercase text-[32px] leading-none mt-1.5">
              Most check-ins
            </h2>
            {board && (
              <p className="text-[12px] text-white/50 mt-1">
                {moment(board.start).format("D MMM")} –{" "}
                {moment(board.end).format("D MMM")} · top {board.size}
              </p>
            )}
          </div>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-3 items-end gap-3">
            {["h-20", "h-28", "h-14"].map((h, i) => (
              <div key={i} className={`${h} rounded-t-[14px] bg-white/10 animate-pulse`} />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-6 text-center text-[13px] text-white/70">
            We couldn&apos;t load the leaderboard.{" "}
            <button onClick={refetch} className="underline text-default-tertiary">
              Try again
            </button>
          </div>
        ) : (
          <div className={`transition ${isFetching ? "opacity-60" : ""}`}>
            {entries.length === 0 ? (
              <div className="mt-6 rounded-[16px] bg-white/[0.06] border border-white/10 p-6 text-center">
                <Ranking size={28} color="var(--color-default)" variant="Bulk" className="mx-auto mb-2" />
                <p className="font-semibold text-[14px]">No check-ins yet this {periodWord}</p>
                <p className="text-[12px] text-white/60 mt-1">
                  Be the first on the board: check in today.
                </p>
              </div>
            ) : (
              <div className="mt-8">
                <Podium entries={entries} />
              </div>
            )}

            {board && board.me.rank === null && (
              <div className="mt-4 rounded-[14px] border border-dashed border-white/20 bg-white/[0.04] px-4 py-3 text-[13px]">
                <p className="font-semibold">You&apos;re not on the leaderboard yet</p>
                <p className="text-white/60 text-[12px] mt-0.5">
                  {board.me.checkIns > 0
                    ? `You have ${board.me.checkIns} check-in${board.me.checkIns === 1 ? "" : "s"} this ${periodWord}. Keep showing up to break into the top ${board.size}.`
                    : `Check in this ${periodWord} to get on the board. Only the top ${board.size} are shown.`}
                </p>
              </div>
            )}

            {board && board.me.rank !== null && board.me.rank > 3 && (
              <p className="mt-4 text-[13px] text-white/70">
                You&apos;re{" "}
                <span className="text-default-tertiary font-bold">#{board.me.rank}</span>{" "}
                this {periodWord} with {board.me.checkIns} check-in
                {board.me.checkIns === 1 ? "" : "s"}.
              </p>
            )}

            {rest.length > 0 && (
              <ol className="mt-4 max-h-[360px] overflow-y-auto -mx-1 px-1 space-y-1.5 [scrollbar-width:thin]">
                {rest.map((entry) => (
                  <li
                    key={entry.rank}
                    className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 ${
                      entry.isMe
                        ? "bg-default/20 border border-default/50"
                        : "bg-white/[0.05]"
                    }`}
                  >
                    <span className="w-7 text-center font-league text-[20px] text-white/60 tabular-nums">
                      {entry.rank}
                    </span>
                    <LeaderAvatar
                      name={entry.name}
                      image={entry.image}
                      className="size-9"
                      fallbackClassName="text-[12px]"
                    />
                    <span className="flex-1 min-w-0 truncate text-[14px] font-medium">
                      {entry.name}
                      {entry.isMe && (
                        <span className="ml-2 rounded-full bg-default px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                          You
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums">
                      {entry.checkIns}
                      <span className="text-white/50 font-normal text-[11px]"> check-in{entry.checkIns === 1 ? "" : "s"}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
