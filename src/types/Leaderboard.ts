export type LeaderboardPeriod = "week" | "month" | "all";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  image: string | null;
  checkIns: number;
  /** Member view only: this row is the signed-in member */
  isMe?: boolean;
  /** Admin view only: the member's id, for linking to their profile */
  _id?: string;
}

export interface Leaderboard {
  period: LeaderboardPeriod;
  /** null for all time */
  start: string | null;
  end: string | null;
  size: number;
  entries: LeaderboardEntry[];
}

export interface MemberLeaderboard extends Leaderboard {
  me: { rank: number | null; checkIns: number };
}
