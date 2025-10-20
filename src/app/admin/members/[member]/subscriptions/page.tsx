"use client";

import Table, { ColumnProps } from "@/components/table";
import React from "react";

const SubscriptionsPage = () => {
  const columns: ColumnProps[] = [
    { label: "Plan Name", field: "" },
    { label: "Duration", field: "" },
  ];
  return <div>{/* <Table columns={columns} rows={[]} /> */}</div>;
};

export default SubscriptionsPage;
