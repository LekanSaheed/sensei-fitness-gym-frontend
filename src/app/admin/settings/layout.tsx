import TabLinks from "@/components/tab-links";
import {
  ADMIN_DASHBOARD,
  ADMIN_SECURITY_SETTINGS,
  ADMIN_SETTINGS,
} from "@/constants/routes";
import React, { ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <TabLinks
        links={[
          { label: "Profile Settings", path: ADMIN_SETTINGS },
          { label: "Security Settings", path: ADMIN_SECURITY_SETTINGS },
        ]}
      />
      {children}
    </div>
  );
};

export default SettingsLayout;
