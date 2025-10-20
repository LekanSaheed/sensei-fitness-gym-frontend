"use client";

import SectionCard from "@/components/SectionCard";
import Table, { ColumnProps } from "@/components/table";
import { MEMBERS } from "@/constants/routes";
import {
  useGetMembersAnalyticsQuery,
  useGetMembersQuery,
} from "@/redux/api-slices/admin.slice";
import { defaultPageSize, onlyFieldsWithValue } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const UsersPage = () => {
  const columns: ColumnProps[] = [
    { label: "Member Name", field: "member" },
    { label: "Email Address", field: "email" },
    { label: "Username", field: "username" },
    { label: "Paid Registration fee", field: "paidRegFee" },
    { label: "Current Subscription Plan", field: "currentPlan" },
    { label: "Subscription Status", field: "currentPlanStatus" },
    {
      label: "Subscription Start Date",
      field: "currentPlanStartDate",
      fieldType: "date",
    },
    {
      label: "Subscription End Date",
      field: "currentPlanEndDate",
      fieldType: "date",
    },
    { label: "Subscription Payment Mode", field: "paymentMode" },
    { label: "Date Registered", field: "createdAt", fieldType: "date" },
  ];

  const searchParams = useSearchParams();

  const { isLoading, isError, refetch, data, isFetching } = useGetMembersQuery(
    onlyFieldsWithValue({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("pageSize") || String(defaultPageSize),
      search: searchParams.get("searchQuery") || "",
    })
  );

  const pageProps = data?.data || null;

  const paginationInfo = pageProps?.paginationInfo;

  const loading = isLoading || isFetching;

  const router = useRouter();

  const rows = (pageProps?.data || [])?.map((r, id) => {
    return {
      id,
      ...r,
      member: `${r?.firstname} ${r?.lastname}`,
      paidRegFee: r?.registrationFeePaid ? "Yes" : "No",
      currentPlan: r?.latestSubscription?.planNameSnapshot,
      currentPlanStatus: (
        <div className="capitalize inline-flex items-center">
          <div
            className={`size-[10px] shrink-0 rounded-full mr-1 ${
              r?.latestSubscription?.status === "active"
                ? "bg-emerald-500"
                : "bg-rose-500"
            }`}
          />
          {r?.latestSubscription?.status || "No subcription"}
        </div>
      ),
      currentPlanStartDate: r?.latestSubscription?.startDate,
      currentPlanEndDate: r?.latestSubscription?.endDate,
      paymentMode: (
        <span className="capitalize">
          {r?.latestSubscription?.paymentMode || "N/A"}
        </span>
      ),
    };
  });

  const getMembersAnalyticsQuery = useGetMembersAnalyticsQuery(null);

  const membersAnalytics = getMembersAnalyticsQuery?.data?.data;

  const cards: { description: string; value: number | undefined }[] = [
    { description: "Total Members", value: membersAnalytics?.totalMembers },
    {
      description: "Total Active Members",
      value: membersAnalytics?.activeMembers,
    },
    {
      description: "Registered This Month",
      value: membersAnalytics?.registeredThisMonth,
    },
    {
      description: "Members Without Active Sub",
      value: membersAnalytics?.membersWithoutActiveSub,
    },
  ];
  return (
    <div>
      <div className="mb-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, id) => {
          return (
            <SectionCard
              {...card}
              key={id}
              loading={
                getMembersAnalyticsQuery?.isLoading ||
                getMembersAnalyticsQuery?.isFetching
              }
            />
          );
        })}
      </div>

      <Table
        loading={loading}
        error={isError}
        refetch={refetch}
        useSerial
        totalRecords={paginationInfo?.totalItems || 0}
        columns={columns}
        rows={rows}
        onRowClick={(row) => {
          router.push(
            `${MEMBERS}/${row?._id}?name=${row?.firstname || ""} ${
              row?.lastname || ""
            }`
          );
        }}
      />
    </div>
  );
};

export default UsersPage;
