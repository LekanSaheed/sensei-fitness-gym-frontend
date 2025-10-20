"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import Table, { ColumnProps } from "@/components/table";

import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  useCheckUserInMutation,
  useGetCheckInsQuery,
} from "@/redux/api-slices/admin.slice";
import { ErrorResponse } from "@/types";
import { defaultPageSize, isFetchBaseQueryError } from "@/utils";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const UserCheckInPage = () => {
  const columns: ColumnProps[] = [
    {
      label: "Time Checked In",
      field: "createdAt",
      fieldType: "date",
      bold: true,
    },
    { label: "Time Checked In From Now", field: "fromNow" },
    { label: "Check-in type", field: "checkInType" },
    { label: "Checked in by", field: "checkedBy" },
  ];

  const searchParams = useSearchParams();

  const params = useParams();

  const { isError, isLoading, isFetching, refetch, data } = useGetCheckInsQuery(
    {
      limit: searchParams.get("pageSize") || String(defaultPageSize),
      page: searchParams.get("page") || String(1),
      userId: params?.member?.toString(),
    }
  );

  const loading = isLoading || isFetching;

  const pageProps = data?.data;

  const paginationInfo = pageProps?.paginationInfo;

  const rows = pageProps?.data || [];

  const [checkIn, checkInStatus] = useCheckUserInMutation();

  const checkUserIn = async () => {
    const res = await checkIn({ userId: params?.member?.toString() || "" });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(response?.message || "Successful");
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  return (
    <div>
      <Table
        loading={loading}
        error={isError}
        totalRecords={paginationInfo?.totalItems || 0}
        refetch={refetch}
        showSearch={false}
        columns={columns}
        customNode={
          <Alert
            title="Check member in?"
            description="Are you sure you want to check this member in for today?"
            alertTrigger={
              <Button
                label="Check member in"
                loading={checkInStatus.isLoading}
                color="black"
                size="sm"
              />
            }
            loading={checkInStatus.isLoading}
            onContinueClick={checkUserIn}
          />
        }
        rows={rows.map((row, id) => {
          return {
            ...row,
            id,
            checkedBy:
              row?.checkInType === "admin"
                ? `${row?.checkedInBy?.firstname} ${row?.checkedInBy?.lastname}`
                : "Self",
            fromNow: moment(row?.createdAt).fromNow(),
          };
        })}
      />
    </div>
  );
};

export default UserCheckInPage;
