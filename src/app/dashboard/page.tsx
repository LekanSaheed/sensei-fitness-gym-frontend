"use client";

import QuickActions from "@/components/QuickActions";
import SubscriptionCard from "@/components/subscription-card";
import React from "react";

const UserHomePage = () => {
  return (
    <div>
      <SubscriptionCard />
      <QuickActions />
    </div>
  );
};

export default UserHomePage;
