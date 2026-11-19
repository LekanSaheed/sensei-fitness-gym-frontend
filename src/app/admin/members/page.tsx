"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import SectionCard from "@/components/SectionCard";
import Table, { ColumnProps } from "@/components/table";
import { TableFilter } from "@/components/table/table-controls";
import { MEMBERS } from "@/constants/routes";
import {
  useGetMembersAnalyticsQuery,
  useGetMembersQuery,
} from "@/redux/api-slices/admin.slice";
import {
  collocateMemberName,
  defaultPageSize,
  getInitials,
  onlyFieldsWithValue,
} from "@/utils";
import { UserTick } from "iconsax-react";
import { ACTIVITY_ZONES, ZONE_META } from "@/types/ActivityZone";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const CARD_FILTER_KEYS = [
  "subscriptionStatus",
  "trainer",
  "registered",
  "activityZone",
] as const;

type CardFilterKey = (typeof CARD_FILTER_KEYS)[number];

/** The table's "All" option is the same as no filter */
const paramValue = (v: string | null) => (!v || v === "all" ? "" : v);

const UsersPage = () => {
  const columns: ColumnProps[] = [
    { label: "", field: "avatarProps", fieldType: "avatar" },
    { label: "Member Name", field: "member" },
    { label: "Email Address", field: "email" },
    { label: "Username", field: "username" },
    { label: "Phone Number", field: "phoneNumber" },
    { label: "Paid Registration fee", field: "paidRegFee" },
    { label: "Current Subscription Plan", field: "currentPlan" },
    { label: "Subscription Status", field: "currentPlanStatus" },
    { label: "Activity Zone", field: "activityZone" },
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
      subscriptionStatus: searchParams.get("subscriptionStatus") || "",
      trainer: searchParams.get("trainer") || "",
      activityZone: searchParams.get("activityZone") || "",
      registered: searchParams.get("registered") || "",
    }),
  );

  const pageProps = data?.data || null;

  const paginationInfo = pageProps?.paginationInfo;

  const loading = isLoading || isFetching;

  const router = useRouter();

  const rows = (pageProps?.data || [])?.map((r, id) => {
    const subscriptionActivatedBy = r?.latestSubscription?.activatedBy;
    return {
      id,
      ...r,
      avatarProps: {
        initials: getInitials(collocateMemberName(r)),
        src: r?.profile_picture,
      },
      member: `${r?.firstname} ${r?.lastname}`,
      paidRegFee: r?.registrationFeePaid ? "Yes" : "No",
      activityZone: <ActivityZoneBadge zone={r?.activity?.zone} />,
      currentPlan: r?.latestSubscription?.planNameSnapshot,
      currentPlanStatus: (
        <div className="flex items-center gap-4">
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
          {r?.latestSubscription?.includesTrainer && (
            <div title="Has Trainer" className="shrink-0">
              <UserTick
                size={16}
                variant="Bold"
                color={
                  r?.latestSubscription?.status === "active"
                    ? "var(--color-emerald-500)"
                    : "var(--color-rose-500)"
                }
              />
            </div>
          )}
        </div>
      ),
      currentPlanStartDate: r?.latestSubscription?.startDate,
      currentPlanEndDate: r?.latestSubscription?.endDate,
      paymentMode: (
        <div>
          <p className="capitalize">
            {r?.latestSubscription?.paymentMode || "N/A"}
          </p>
          {typeof subscriptionActivatedBy === "object" && (
            <p className="text-[12px]  mt-1">
              Activated by:
              <span className="text-default">
                {" "}
                {subscriptionActivatedBy?.firstname || ""}{" "}
                {subscriptionActivatedBy?.lastname || ""}
              </span>
            </p>
          )}
        </div>
      ),
    };
  });

  const getMembersAnalyticsQuery = useGetMembersAnalyticsQuery(null);

  const membersAnalytics = getMembersAnalyticsQuery?.data?.data;

  const pathname = usePathname();

  /** Each card is a preset of these table filters ({} = no filter) */
  const cards: {
    description: string;
    value: number | undefined;
    filter: Partial<Record<CardFilterKey, string>>;
  }[] = [
    {
      description: "Total Members",
      value: membersAnalytics?.totalMembers,
      filter: {},
    },
    {
      description: "Total Active Members",
      value: membersAnalytics?.activeMembers,
      filter: { subscriptionStatus: "active" },
    },
    {
      description: "Registered This Month",
      value: membersAnalytics?.registeredThisMonth,
      filter: { registered: "this-month" },
    },
    {
      description: "Members Without Active Sub",
      value: membersAnalytics?.membersWithoutActiveSub,
      filter: { subscriptionStatus: "no-active" },
    },
    {
      description: "Active Members With Trainers",
      value: membersAnalytics?.totalMembersWithTrainers,
      filter: { subscriptionStatus: "active", trainer: "assigned" },
    },
    {
      description: "Active Members Without Trainers",
      value: membersAnalytics?.totalMembersWithOutTrainers,
      filter: { subscriptionStatus: "active", trainer: "not-assigned" },
    },
  ];

  /** A card is selected when the table's filters are exactly its preset */
  const isCardSelected = (filter: Partial<Record<CardFilterKey, string>>) =>
    CARD_FILTER_KEYS.every(
      (key) => paramValue(searchParams.get(key)) === (filter[key] || "")
    );

  /** Apply a card's filters (or clear them when it's already selected) */
  const selectCard = (filter: Partial<Record<CardFilterKey, string>>) => {
    const params = new URLSearchParams(searchParams.toString());

    const next = isCardSelected(filter) ? {} : filter;

    CARD_FILTER_KEYS.forEach((key) => {
      if (next[key]) params.set(key, next[key]!);
      else params.delete(key);
    });

    params.delete("page");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const filters: TableFilter[] = [
    {
      keyName: "subscriptionStatus",
      title: "Subscription status",
      options: [
        { label: "All subscriptions", value: "all" },
        { label: "Subscription Active", value: "active" },
        { label: "Subscription Expired", value: "expired" },
        { label: "No subscription", value: "no-sub" },
        { label: "No active subscription", value: "no-active" },
      ],
    },
    {
      keyName: "registered",
      title: "Registered",
      options: [
        { label: "Any time", value: "all" },
        { label: "This month", value: "this-month" },
      ],
    },
    {
      keyName: "trainer",
      title: "Trainer Assigned",
      options: [
        { label: "Any trainer status", value: "all" },
        { label: "Trainer Assigned", value: "assigned" },
        { label: "Trainer Not Assigned", value: "not-assigned" },
      ],
    },
    {
      keyName: "activityZone",
      title: "Activity zone",
      options: [
        { label: "All zones", value: "all" },
        ...ACTIVITY_ZONES.map((zone) => ({
          label: ZONE_META[zone].label,
          value: zone,
        })),
      ],
    },
  ];
  return (
    <div>
      <div className="mb-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, id) => {
          return (
            <SectionCard
              description={card.description}
              value={card.value}
              key={id}
              onClick={() => selectCard(card.filter)}
              selected={isCardSelected(card.filter)}
              title={
                isCardSelected(card.filter) && id > 0
                  ? "Click to clear this filter"
                  : `Show ${card.description.toLowerCase()} in the table`
              }
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
        filters={filters}
        onRowClick={(row) => {
          router.push(
            `${MEMBERS}/${row?._id}?name=${row?.firstname || ""} ${
              row?.lastname || ""
            }`,
          );
        }}
      />
    </div>
  );
};

export default UsersPage;
