"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { useForgotPasswordMutation } from "@/redux/api-slices/auth.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { Metadata } from "next";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [email, setEmail] = useState("");

  const [send, resetStatus] = useForgotPasswordMutation();

  const sendNotification = async () => {
    const res = await send({ email });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(
          "A password reset link has been sent. Please check your inbox/spam to continue"
        );
        setEmail("");
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendNotification();
      }}
    >
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label={"Email address"}
        type="email"
        inputMode="email"
        required
        placeholder="Email address"
      />
      <Button
        brandedFont
        label="Proceed"
        fullWidth
        loading={resetStatus.isLoading}
      />
    </form>
  );
};

export default Page;
