"use client";

import TabLinks from "@/components/tab-links";
import { ACTIVITY_ZONE_SETTINGS, ACTIVITY_ZONES } from "@/constants/routes";
import { useUserCanPerformAction } from "@/hooks/usePermissions";
import React, { ReactNode } from "react";

const ActivityZonesLayout = ({ children }: { children: ReactNode }) => {
  const canPerform = useUserCanPerformAction();

  const links = [
    { label: "Members by Zone", path: ACTIVITY_ZONES },
    ...(canPerform(["manage_activity_zones"])
      ? [{ label: "Zone & Reminder Settings", path: ACTIVITY_ZONE_SETTINGS }]
      : []),
  ];

  return (
    <div>
      <TabLinks links={links} />
      {children}
    </div>
  );
};

export default ActivityZonesLayout;
