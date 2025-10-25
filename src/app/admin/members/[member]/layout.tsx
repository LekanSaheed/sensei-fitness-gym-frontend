"use client";

import TabLinks from "@/components/tab-links";
import { MEMBERS } from "@/constants/routes";
import { useSearchParams } from "next/navigation";
import React, { ReactNode } from "react";

const MemberLayout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ member: string }>;
}) => {
  const { member } = React.use(params);

  const currentPath = `${MEMBERS}/${member}`;

  return (
    <div>
      <TabLinks
        includeQuery
        links={[
          { label: "Profile", path: currentPath },
          { label: "Subscriptions", path: `${currentPath}/subscriptions` },
          { label: "Check-ins", path: `${currentPath}/check-ins` },
          { label: "Payments", path: `${currentPath}/payments` },
        ]}
      />
      {children}
    </div>
  );
};

export default MemberLayout;
