"use client";

import SectionCard from "@/components/SectionCard";
import { DropdownOption } from "@/components/select-input";
import Table, { ColumnProps } from "@/components/table";
import {
  useGetPaymentsLogsQuery,
  useGetRevenuePageAnalyticsQuery,
} from "@/redux/api-slices/admin.slice";
import { PaymentLogStatus } from "@/types/PaymentLog";
import { defaultPageSize, onlyFieldsWithValue } from "@/utils";
import FormatNumber from "@/utils/format-number";
import { useSearchParams } from "next/navigation";
import React from "react";

const PaymentsPage = () => {
  const columns: ColumnProps[] = [
    { label: "Member Name", field: "userDetails" },
    { label: "Total Amount", field: "amount", fieldType: "currency" },
    { label: "Status", field: "status" },
    { label: "Payment Break Down", field: "pb" },
    { label: "Payment Mode", field: "paymentMode" },
    { label: "Date Initiated", field: "createdAt", fieldType: "date" },
    { label: "Date Updated", field: "updatedAt", fieldType: "date" },
    { label: "Payment Reference", field: "_id" },
  ];

  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";

  const limit = searchParams.get("pageSize") || String(defaultPageSize);

  const statusFilter = searchParams.get("statusFilter") || "";

  const { isError, isFetching, isLoading, data, refetch } =
    useGetPaymentsLogsQuery(onlyFieldsWithValue({ page, limit, statusFilter }));

  const pageProps = data?.data;

  const rows = pageProps?.data || [];

  const paginationInfo = pageProps?.paginationInfo;

  const getRevenueAnalytics = useGetRevenuePageAnalyticsQuery(null);

  const revenueData = getRevenueAnalytics?.data?.data;

  const revenueLoading =
    getRevenueAnalytics?.isLoading || getRevenueAnalytics?.isFetching;

  const cards: { description: string; value: number | undefined }[] = [
    { description: "Revenue Today", value: revenueData?.todayRevenue },
    {
      description: "Revenue This Week",
      value: revenueData?.weekRevenue,
    },
    {
      description: "Revenue This Month",
      value: revenueData?.monthRevenue,
    },
    {
      description: "Revenue This Year",
      value: revenueData?.yearRevenue,
    },
  ];

  const statusClass: Record<PaymentLogStatus, string> = {
    failed: "bg-rose-500",
    pending: "bg-amber-500",
    successful: "bg-emerald-500",
  };

  const statusDropdown: DropdownOption[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Successful", value: "successful" },
    { label: "Failed", value: "failed" },
  ];
  return (
    <div>
      <div className="mb-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, id) => {
          return (
            <SectionCard
              loading={revenueLoading}
              {...card}
              value={FormatNumber.ngnAmount(card?.value || 0)}
              key={id}
            />
          );
        })}
      </div>
      <Table
        filters={[
          {
            keyName: "statusFilter",
            title: "Status",
            options: statusDropdown,
            classNames: {
              trigger: "w-[130px]",
            },
          },
        ]}
        totalRecords={paginationInfo?.totalItems || 0}
        loading={isLoading || isFetching}
        error={isError}
        refetch={refetch}
        columns={columns}
        rows={rows.map((row, id) => {
          const breakdown = row?.breakDown;

          const details: {
            label: string;
            value: number | string;
            hide?: boolean;
            type?: "default" | "currency";
          }[] = [
            {
              label: "Payment For",
              value: breakdown?.planNameSnapshot,
              hide: !breakdown?.planNameSnapshot,
            },
            {
              label: "Registration Fee",
              value: breakdown?.registrationFeeSnapshot,
              hide: !breakdown?.registrationFeeSnapshot,
              type: "currency",
            },
            {
              label: "Subscription Fee",
              value: breakdown?.subscriptionFeeSnapshot,
              hide: !breakdown?.subscriptionFeeSnapshot,
              type: "currency",
            },
            {
              label: "Trainer Fee",
              value: breakdown?.trainerFeeSnapshot,
              hide:
                !breakdown?.trainerFeeSnapshot ||
                breakdown?.trainerFeeSnapshot == 0,
              type: "currency",
            },
          ];
          return {
            id,
            ...row,
            userDetails: `${row?.user?.firstname || ""} ${
              row?.user?.lastname || ""
            }`,
            status: (
              <div className="inline-flex items-center">
                <div
                  className={`size-[10px] rounded-full mr-1 shrink-0 ${
                    statusClass[row?.status]
                  }`}
                />
                <span className="">{row?.status}</span>
              </div>
            ),
            pb: (
              <ul>
                {details
                  .filter((p) => !p?.hide)
                  .map((p, id) => {
                    return (
                      <li key={id} className="text-[10px]">
                        <span className="text-gray-500">{p?.label}:</span>{" "}
                        <span className="font-medium">
                          {p?.type === "currency"
                            ? FormatNumber.ngnAmount((p?.value as number) || 0)
                            : p?.value}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ),
          };
        })}
      />
    </div>
  );
};

export default PaymentsPage;
