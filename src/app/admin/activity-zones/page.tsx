"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import ActivityZoneCards from "@/components/ActivityZoneCards";
import InactivityReasonsCard from "@/components/InactivityReasonsCard";
import Table, { ColumnProps } from "@/components/table";
import { TableFilter } from "@/components/table/table-controls";
import { MEMBERS } from "@/constants/routes";
import { useGetMembersQuery } from "@/redux/api-slices/admin.slice";
import {
  ACTIVITY_ZONES,
  ActivityZone,
  ZONE_META,
} from "@/types/ActivityZone";
import {
  collocateMemberName,
  defaultPageSize,
  getInitials,
  onlyFieldsWithValue,
} from "@/utils";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const daysAgo = (date?: string | null) => {
  if (!date) return null;

  return moment().startOf("day").diff(moment(date).startOf("day"), "days");
};

const ActivityCell = ({
  date,
  emptyLabel,
}: {
  date?: string | null;
  emptyLabel: string;
}) => {
  const days = daysAgo(date);

  if (days === null)
    return <span className="text-gray-500 italic">{emptyLabel}</span>;

  return (
    <div>
      <p>{moment(date).format("ll")}</p>
      <p className="text-[11px] text-gray-500">
        {days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`}
      </p>
    </div>
  );
};

const ActivityZonesPage = () => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const pathname = usePathname();

  const zoneParam = searchParams.get("activityZone");

  const selectedZone = ACTIVITY_ZONES.includes(zoneParam as ActivityZone)
    ? (zoneParam as ActivityZone)
    : null;

  const selectZone = (zone: ActivityZone | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (zone) params.set("activityZone", zone);
    else params.delete("activityZone");

    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const columns: ColumnProps[] = [
    { label: "", field: "avatarProps", fieldType: "avatar" },
    { label: "Member Name", field: "member" },
    { label: "Email Address", field: "email" },
    { label: "Activity Zone", field: "zone" },
    { label: "Last Check-in", field: "lastCheckIn" },
    { label: "Last Login", field: "lastLogin" },
    { label: "In Zone Since", field: "zoneEnteredAt", fieldType: "date" },
    { label: "Previous Zone", field: "previousZone" },
  ];

  const { isLoading, isError, refetch, data, isFetching } = useGetMembersQuery(
    onlyFieldsWithValue({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("pageSize") || String(defaultPageSize),
      search: searchParams.get("searchQuery") || "",
      activityZone: selectedZone || "",
      subscriptionStatus: searchParams.get("subscriptionStatus") || "",
      trainer: searchParams.get("trainer") || "",
    })
  );

  const loading = isLoading || isFetching;

  const pageProps = data?.data || null;

  const rows = (pageProps?.data || []).map((r, id) => ({
    id,
    ...r,
    avatarProps: {
      initials: getInitials(collocateMemberName(r)),
      src: r?.profile_picture,
    },
    member: `${r?.firstname} ${r?.lastname}`,
    zone: <ActivityZoneBadge zone={r?.activity?.zone} />,
    lastCheckIn: (
      <ActivityCell date={r?.lastCheckInAt} emptyLabel="Never checked in" />
    ),
    lastLogin: <ActivityCell date={r?.lastLoginAt} emptyLabel="No login recorded" />,
    zoneEnteredAt: r?.activity?.zoneEnteredAt,
    previousZone: r?.activity?.previousZone ? (
      <ActivityZoneBadge zone={r.activity.previousZone} />
    ) : (
      "N/A"
    ),
  }));

  const filters: TableFilter[] = [
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
    {
      keyName: "subscriptionStatus",
      title: "Subscription status",
      options: [
        { label: "All subscriptions", value: "all" },
        { label: "Subscription Active", value: "active" },
        { label: "Subscription Expired", value: "expired" },
        { label: "No subscription", value: "no-sub" },
      ],
    },
    {
      keyName: "trainer",
      title: "Trainer",
      options: [
        { label: "Any trainer status", value: "all" },
        { label: "Trainer Assigned", value: "assigned" },
        { label: "Trainer Not Assigned", value: "not-assigned" },
      ],
    },
  ];

  return (
    <div>
      <ActivityZoneCards selected={selectedZone} onSelect={selectZone} />

      {selectedZone && (
        <div className="flex items-center gap-2 mb-2 text-[13px]">
          Showing <ActivityZoneBadge zone={selectedZone} /> users
          <button
            className="text-default underline text-[12px]"
            onClick={() => selectZone(null)}
          >
            Clear
          </button>
        </div>
      )}

      <Table
        loading={loading}
        error={isError}
        refetch={refetch}
        useSerial
        totalRecords={pageProps?.paginationInfo?.totalItems || 0}
        columns={columns}
        rows={rows}
        filters={filters}
        onRowClick={(row) => {
          router.push(
            `${MEMBERS}/${row?._id}?name=${row?.firstname || ""} ${
              row?.lastname || ""
            }`
          );
        }}
      />

      <InactivityReasonsCard />
    </div>
  );
};

export default ActivityZonesPage;
