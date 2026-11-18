"use client";

import ActivityZoneNotice from "@/components/ActivityZoneNotice";
import CheckInCalendar from "@/components/CheckInCalendar";
import Leaderboard from "@/components/dashboard/Leaderboard";
import StatTiles from "@/components/dashboard/StatTiles";
import TodayCard from "@/components/dashboard/TodayCard";
import QuickActions from "@/components/QuickActions";
import SubscriptionCard from "@/components/subscription-card";
import React from "react";

const UserHomePage = () => {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex flex-col gap-3">
        <TodayCard />
        <ActivityZoneNotice />
        <StatTiles />
      </div>
      <QuickActions />
      <SubscriptionCard />
      <CheckInCalendar />
      <Leaderboard />
    </div>
  );
};

export default UserHomePage;
