"use client";

import DashboardAreaChart from "@/components/DashboardAreaChart";
import SectionCard, { SectionCardProps } from "@/components/SectionCard";
import { DropdownOption } from "@/components/select-input";
import {
  useAdminGetCheckInAnalyticsQuery,
  useGetDashboardRevenueAnalyticsQuery,
  useGetMembersAnalyticsQuery,
} from "@/redux/api-slices/admin.slice";
import FormatNumber from "@/utils/format-number";
import { useSearchParams } from "next/navigation";
import React from "react";

const AdminHomePage = () => {
  const searchParams = useSearchParams();

  const revenueRange = searchParams.get("revenueRange");

  const checkInRange = searchParams.get("checkInRange");

  const revenueQuery = useGetDashboardRevenueAnalyticsQuery(revenueRange || "");

  const reevnueData = revenueQuery?.data?.data;

  const revenueLoading = revenueQuery?.isLoading || revenueQuery?.isFetching;

  const getCheckInAnalyticsQuery = useAdminGetCheckInAnalyticsQuery(null);

  const checkInAnalytics = getCheckInAnalyticsQuery?.data?.data;

  const checkInLoading =
    getCheckInAnalyticsQuery?.isLoading || getCheckInAnalyticsQuery?.isFetching;

  const getMembersAnalyticsQuery = useGetMembersAnalyticsQuery(null);

  const membersAnalyticsLoading =
    getMembersAnalyticsQuery?.isLoading || getMembersAnalyticsQuery?.isFetching;

  const membersAnalytics = getMembersAnalyticsQuery?.data?.data;

  const revenueDropdown: DropdownOption[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "This Year", value: "thisYear" },
    { label: "All time", value: "all" },
  ];

  const checkInsDropdown: DropdownOption[] = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "All TIme", value: "total" },
  ];

  const selectedCheckInRange =
    checkInsDropdown?.find((c) => c?.value === checkInRange) ||
    checkInsDropdown[0];

  const selectedRevenueRange =
    revenueDropdown?.find((r) => r?.value === revenueRange) ||
    revenueDropdown[2];

  const cards: SectionCardProps[] = [
    {
      description: "Total Revenue ",
      value: FormatNumber.ngnAmount(reevnueData?.total || 0),
      loading: revenueLoading,
      dropdown: {
        options: revenueDropdown,
        selected: selectedRevenueRange,
        keyName: "revenueRange",
      },
      classNames: {
        value: "!text-lg lg:!text-2xl",
      },
    },
    {
      description: "Total Members",
      value: membersAnalytics?.totalMembers,
      loading: membersAnalyticsLoading,
    },
    {
      description: "Active Members",
      value: membersAnalytics?.activeMembers,
      loading: membersAnalyticsLoading,
    },
    {
      description: "Check Ins ",
      value:
        checkInAnalytics?.[
          selectedCheckInRange?.value as keyof typeof checkInAnalytics
        ] || 0,
      dropdown: {
        keyName: "checkInRange",
        options: checkInsDropdown,
        selected: selectedCheckInRange,
      },
    },
  ];
  return (
    <div>
      <div className="mb-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, id) => {
          return <SectionCard {...card} key={id} />;
        })}
      </div>
      <div className="lg:flex gap-4">
        <div className="lg:basis-[70%] ">
          <DashboardAreaChart />
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
