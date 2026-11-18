import { LeaderboardEntry } from "@/types/Leaderboard";
import { Crown1 } from "iconsax-react";
import React, { ReactNode } from "react";
import LeaderAvatar from "./LeaderAvatar";

type Tone = "dark" | "light";

/** Visual order on the podium: 2nd on the left, 1st in the middle, 3rd right */
const ORDER = [2, 1, 3] as const;

const STYLE = {
  1: {
    pedestal: "h-28 md:h-36 bg-gradient-to-b from-default to-default-secondary",
    avatar: "size-[72px] md:size-20 ring-4 ring-default",
    number: "text-[44px] md:text-[52px]",
  },
  2: {
    pedestal: "h-20 md:h-24 bg-gradient-to-b from-gray-300 to-gray-400",
    avatar: "size-14 md:size-16 ring-4 ring-gray-300",
    number: "text-[34px] md:text-[40px]",
  },
  3: {
    pedestal: "h-14 md:h-[72px] bg-gradient-to-b from-amber-600 to-amber-800",
    avatar: "size-14 md:size-16 ring-4 ring-amber-600",
    number: "text-[30px] md:text-[34px]",
  },
} as const;

/**
 * The top three on pedestals: the leader in the centre on the tallest one,
 * second on the left and third on the right. Empty spots are shown as open.
 */
const Podium = ({
  entries,
  tone = "dark",
  renderName,
}: {
  entries: LeaderboardEntry[];
  tone?: Tone;
  /** Wrap the name, e.g. in a link to the member's profile */
  renderName?: (entry: LeaderboardEntry, name: ReactNode) => ReactNode;
}) => {
  const dark = tone === "dark";

  return (
    <ol className="grid grid-cols-3 items-end gap-2 md:gap-3">
      {ORDER.map((rank) => {
        const entry = entries.find((e) => e.rank === rank);

        const style = STYLE[rank];

        const name = entry ? (
          <span
            className={`block text-[13px] md:text-[14px] font-semibold leading-tight line-clamp-2 break-words ${
              entry.isMe ? "text-default" : ""
            }`}
          >
            {entry.name}
            {entry.isMe && (
              <span className="block text-[10px] uppercase tracking-[0.15em] font-bold mt-0.5">
                You
              </span>
            )}
          </span>
        ) : (
          <span
            className={`block text-[12px] ${dark ? "text-white/40" : "text-gray-400"}`}
          >
            Open spot
          </span>
        );

        return (
          <li
            key={rank}
            className="flex flex-col items-center text-center min-w-0"
            aria-label={
              entry
                ? `Position ${rank}: ${entry.name}, ${entry.checkIns} check-ins`
                : `Position ${rank}: open`
            }
          >
            <div className="relative mb-2">
              {rank === 1 && entry && (
                <Crown1
                  size={28}
                  variant="Bold"
                  color="var(--color-default)"
                  className="absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow"
                />
              )}
              {entry ? (
                <LeaderAvatar
                  name={entry.name}
                  image={entry.image}
                  className={style.avatar}
                  fallbackClassName="text-[18px] md:text-[20px]"
                />
              ) : (
                <span
                  className={`${style.avatar.split(" ").slice(0, 2).join(" ")} rounded-full border-2 border-dashed inline-flex items-center justify-center text-[18px] ${
                    dark ? "border-white/20 text-white/30" : "border-gray-300 text-gray-300"
                  }`}
                >
                  ?
                </span>
              )}
            </div>

            <div className="w-full px-0.5 min-h-[34px]">
              {entry && renderName ? renderName(entry, name) : name}
            </div>

            <p
              className={`text-[11px] mt-0.5 mb-2 ${dark ? "text-white/60" : "text-gray-500"}`}
            >
              {entry
                ? `${entry.checkIns} check-in${entry.checkIns === 1 ? "" : "s"}`
                : " "}
            </p>

            <div
              className={`w-full rounded-t-[14px] flex items-start justify-center pt-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] ${style.pedestal} ${
                entry ? "" : "opacity-40"
              }`}
            >
              <span
                className={`font-league leading-none text-white/95 drop-shadow ${style.number}`}
              >
                {rank}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Podium;
