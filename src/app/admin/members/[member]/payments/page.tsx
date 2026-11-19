"use client";

import Table, { ColumnProps } from "@/components/table";
import { useUserCanPerformAction } from "@/hooks/usePermissions";
import { usePaginationProps } from "@/hooks/usePaginate";
import { useGetPaymentsLogsQuery } from "@/redux/api-slices/admin.slice";
import PaymentLog, { PaymentLogStatus } from "@/types/PaymentLog";
import { onlyFieldsWithValue } from "@/utils";
import FormatNumber from "@/utils/format-number";
import { ShieldCross } from "iconsax-react";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const STATUS_DOT: Record<PaymentLogStatus, string> = {
  successful: "bg-emerald-500",
  pending: "bg-amber-500",
  failed: "bg-rose-500",
  expired: "bg-gray-400",
};

/** What a payment was for, in plain words */
const paymentFor = (p: PaymentLog) => {
  const b = p.breakDown || ({} as PaymentLog["breakDown"]);

  if (!p.plan && b.registrationFeeSnapshot && !b.subscriptionFeeSnapshot) {
    return "Registration fee";
  }

  return b.planNameSnapshot || "Payment";
};

/** One member's payments: totals, then every payment with its breakdown */
const MemberPaymentsPage = () => {
  const { member } = useParams() as { member: string };

  const { limit, page } = usePaginationProps();

  const statusFilter = useSearchParams().get("statusFilter") || "";

  const canView = useUserCanPerformAction()(["view_payment_logs"]);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetPaymentsLogsQuery(
      onlyFieldsWithValue({ page, limit, statusFilter, userId: member }),
      { skip: !canView }
    );

  const rows = data?.data?.data || [];

  const summary = data?.data?.summary;

  const columns: ColumnProps[] = [
    { label: "Payment For", field: "forLabel" },
    { label: "Amount", field: "amount", fieldType: "currency" },
    { label: "Status", field: "statusNode" },
    { label: "Breakdown", field: "breakdownNode" },
    { label: "Paid Via", field: "mode" },
    { label: "Date", field: "createdAt", fieldType: "date" },
    { label: "Payment Reference", field: "_id" },
  ];

  if (!canView) {
    return (
      <div className="rounded-[18px] bg-white border border-gray-200/80 p-10 text-center">
        <ShieldCross size={28} color="var(--color-default)" variant="Bulk" className="mx-auto mb-2" />
        <p className="font-semibold">You can&apos;t view payment logs</p>
        <p className="text-[13px] text-gray-500 mt-1">
          Ask a super admin for the &ldquo;view payment logs&rdquo; permission.
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total paid",
      value: summary ? FormatNumber.ngnAmount(summary.totalPaid) : "…",
      sub: "Successful payments only",
    },
    {
      label: "Successful payments",
      value: summary ? summary.successful : "…",
      sub: summary ? `of ${summary.all} payment attempt${summary.all === 1 ? "" : "s"}` : "",
    },
    {
      label: "Last payment",
      value: summary?.lastPaidAt ? moment(summary.lastPaidAt).format("D MMM YYYY") : summary ? "None yet" : "…",
      sub: summary?.lastPaidAt ? moment(summary.lastPaidAt).fromNow() : "",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-[16px] border border-gray-200/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{c.label}</p>
            <p className="text-[22px] font-black tracking-tight mt-1 tabular-nums">{c.value}</p>
            {c.sub && <p className="text-[12px] text-gray-500">{c.sub}</p>}
          </div>
        ))}
      </div>

      <Table
        showSearch={false}
        loading={isLoading || isFetching}
        error={isError}
        refetch={refetch}
        totalRecords={data?.data?.paginationInfo?.totalItems || 0}
        columns={columns}
        filters={[
          {
            keyName: "statusFilter",
            title: "Status",
            options: [
              { label: "All", value: "all" },
              { label: "Successful", value: "successful" },
              { label: "Pending", value: "pending" },
              { label: "Failed", value: "failed" },
              { label: "Expired", value: "expired" },
            ],
            classNames: { trigger: "w-[130px]" },
          },
        ]}
        rows={rows.map((p, id) => {
          const b = p.breakDown || ({} as PaymentLog["breakDown"]);

          const parts = [
            { label: "Plan", value: b.subscriptionFeeSnapshot },
            { label: "Registration", value: b.registrationFeeSnapshot },
            { label: "Trainer", value: b.trainerFeeSnapshot },
          ].filter((x) => x.value);

          return {
            ...p,
            id,
            forLabel: (
              <div>
                <p className="font-medium">{paymentFor(p)}</p>
                {!!b.planDurationSnapshot && (
                  <p className="text-[11px] text-gray-500">
                    {b.planDurationSnapshot} day{b.planDurationSnapshot === 1 ? "" : "s"}
                  </p>
                )}
              </div>
            ),
            statusNode: (
              <span className="inline-flex items-center capitalize">
                <span className={`size-[10px] rounded-full mr-1 shrink-0 ${STATUS_DOT[p.status]}`} />
                {p.status}
              </span>
            ),
            breakdownNode: parts.length ? (
              <ul className="text-[11px]">
                {parts.map((x) => (
                  <li key={x.label}>
                    <span className="text-gray-500">{x.label}:</span>{" "}
                    <span className="font-medium">{FormatNumber.ngnAmount(x.value)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              "—"
            ),
            mode: p.paymentMode === "admin" ? "Front desk" : p.paymentMode === "gateway" ? "Online" : p.paymentMode,
          };
        })}
      />
    </div>
  );
};

export default MemberPaymentsPage;
