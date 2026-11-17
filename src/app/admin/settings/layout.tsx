"use client";

import TabLinks from "@/components/tab-links";
import {
  ADMIN_NOTIFICATION_SETTINGS,
  ADMIN_CHECK_IN_LOCATION_SETTINGS,
  ADMIN_SECURITY_SETTINGS,
  ADMIN_SETTINGS,
} from "@/constants/routes";
import { useUserCanPerformAction } from "@/hooks/usePermissions";
import React, { ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  const canPerform = useUserCanPerformAction();

  return (
    <div>
      <TabLinks
        links={[
          { label: "Profile Settings", path: ADMIN_SETTINGS },
          { label: "Security Settings", path: ADMIN_SECURITY_SETTINGS },
          ...(canPerform(["manage_notification_settings"])
            ? [{ label: "Notifications", path: ADMIN_NOTIFICATION_SETTINGS }]
            : []),
          ...(canPerform(["manage_check_in_location"])
            ? [
                {
                  label: "Check-in Location",
                  path: ADMIN_CHECK_IN_LOCATION_SETTINGS,
                },
              ]
            : []),
        ]}
      />
      {children}
    </div>
  );
};

export default SettingsLayout;
