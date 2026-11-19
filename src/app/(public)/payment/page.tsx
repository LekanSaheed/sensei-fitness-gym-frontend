"use client";

import Button from "@/components/button";
import SectionLoader from "@/components/SectionLoader";
import { DASHBOARD } from "@/constants/routes";
import { useActivateSubQuery } from "@/redux/api-slices/subscription.slice";
import { Clock, CloseCircle, TickCircle } from "iconsax-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import moment from "moment";

const PaymentConfirmationPage = () => {
  const searchParams = useSearchParams();

  const ref = searchParams.get("reference")?.toString() || "";

  const { isLoading, isFetching, isError, refetch, data } = useActivateSubQuery(
    ref,
    {
      skip: !ref,
    }
  );

  const status = data?.data?.status;

  const loading = isLoading || isFetching;

  if (!ref) {
    return <div>No reference found, please exit this page</div>;
  }

  return (
    <div>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!loading && !isError && (
        <div className="flex items-center h-[300px] flex-col justify-center">
          {React.createElement(
            status === "success"
              ? TickCircle
              : status === "failed"
              ? CloseCircle
              : Clock,
            {
              color:
                status === "success"
                  ? "green"
                  : status === "failed"
                  ? "red"
                  : "yellow",
              size: 80,
            }
          )}
          {status === "success" && data?.data?.scheduled && data.data.startDate && (
            <p className="mt-4 max-w-[320px] text-center text-[14px]">
              Payment received. Your new plan will start on{" "}
              <strong>{moment(data.data.startDate).format("ddd, D MMM YYYY")}</strong>,
              when your current plan ends.
            </p>
          )}
          {status === "success" && (
            <Link href={DASHBOARD} className="mt-4">
              <Button label="Go to dashboard" variant="outlined" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmationPage;
