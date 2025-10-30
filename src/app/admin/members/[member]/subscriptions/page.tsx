"use client";

import Table, { ColumnProps } from "@/components/table";
import { usePaginationProps } from "@/hooks/usePaginate";
import { useGetMembersSubscriptionsQuery } from "@/redux/api-slices/admin.slice";
import { SubscriptionStatus } from "@/redux/api-slices/subscription.slice";
import { useParams } from "next/navigation";
import React from "react";

const SubscriptionsPage = () => {
  const columns: ColumnProps[] = [
    { label: "Plan Name", field: "planNameSnapshot" },
    { label: "Status", field: "status" },
    { label: "Duration", field: "duration" },
    { label: "Includes Trainer?", field: "hasTrainer" },
    { label: "Payment Mode", field: "paymentMode" },
    { label: "Amount", field: "planBasePriceSnapshot", fieldType: "currency" },
    { label: "Start Date", field: "startDate", fieldType: "date" },
    { label: "End Date", field: "endDate", fieldType: "date" },
  ];

  const { limit, page } = usePaginationProps();

  const { member } = useParams() as { member: string };

  const { isError, isLoading, data, refetch, isFetching } =
    useGetMembersSubscriptionsQuery({ limit, page, userId: member });

  const loading = isLoading || isFetching;

  const pageProps = data?.data;

  const rows = pageProps?.data || [];

  const paginationInfo = pageProps?.paginationInfo;

  const statusClass: Record<SubscriptionStatus, string> = {
    expired: "bg-rose-500",
    canceled: "bg-gray-500",
    active: "bg-emerald-500",
  };

  return (
    <div>
      <Table
        showSearch={false}
        error={isError}
        refetch={refetch}
        totalRecords={paginationInfo?.totalItems || 0}
        columns={columns}
        rows={rows?.map((r, id) => {
          return {
            ...r,
            duration: `${r?.planDurationInDaysSnapshot} day${
              r?.planDurationInDaysSnapshot > 1 ? "s" : ""
            }`,
            status: (
              <div className="inline-flex items-center">
                <div
                  className={`size-[10px] rounded-full mr-1 shrink-0 ${
                    statusClass[r?.status]
                  }`}
                />
                <span className="">{r.status}</span>
              </div>
            ),
            hasTrainer: r?.includesTrainer ? "Yes" : "No",
          };
        })}
        loading={loading}
      />{" "}
    </div>
  );
};

export default SubscriptionsPage;
