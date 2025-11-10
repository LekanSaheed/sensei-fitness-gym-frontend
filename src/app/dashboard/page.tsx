"use client";

import CheckInCalendar from "@/components/CheckInCalendar";
import CheckInNotifier from "@/components/CheckInNotifier";
import CheckInsHistory from "@/components/CheckInsHistory";
import QuickActions from "@/components/QuickActions";
import SubscriptionCard from "@/components/subscription-card";
import React from "react";

const UserHomePage = () => {
  return (
    <div>
      <SubscriptionCard />
      <CheckInNotifier />
      <QuickActions />
      <CheckInCalendar />
      {/* <CheckInsHistory /> */}
    </div>
  );
};

export default UserHomePage;
