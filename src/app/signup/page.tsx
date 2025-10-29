"use client";

import React, { useState } from "react";

import { useCreateSessionMutation } from "@/redux/api-slices/auth.slice";
import toast from "react-hot-toast";
import { isFetchBaseQueryError } from "@/utils";
import { ErrorResponse, ResponseType } from "@/types";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { useRouter } from "next/navigation";
import Input from "@/components/input";
import Button from "@/components/button";

const Page = () => {
  const [create, createStatus] = useCreateSessionMutation();

  const [email, setEmail] = useState("");

  const router = useRouter();

  const createSession = async () => {
    const res = await create(email);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(
          response?.message || "Please check your mail for further steps"
        );

        const url = response?.data?.url;
        if (url) {
          router.push(url);
        }
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          createSession();
        }}
      >
        <Input
          required
          value={email}
          label={"Email address"}
          type="email"
          inputMode="email"
          placeholder="address@domain.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button label="Continue" fullWidth loading={createStatus.isLoading} />
      </form>
    </div>
  );
};

export default Page;
