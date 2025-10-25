"use client";

import CheckInsHistory from "@/components/CheckInsHistory";
import QuickActions from "@/components/QuickActions";
import SubscriptionCard from "@/components/subscription-card";
import React from "react";

const UserHomePage = () => {
  return (
    <div>
      <SubscriptionCard />
      <QuickActions />
      <CheckInsHistory />
    </div>
  );
};

export default UserHomePage;
