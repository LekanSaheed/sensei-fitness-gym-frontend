"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  useGetResetTokenQuery,
  useResetPasswordMutation,
} from "@/redux/api-slices/auth.slice";
import { ErrorResponse, ResponseType } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { useFormik } from "formik";
import { useSearchParams, useRouter } from "next/navigation";

import React from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

const validationSchema = yup.object({
  newPassword: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must contain upper, lower, number & special char"
    )
    .required("Please enter your new password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Should match with your new password")
    .required("Confirm Password is required"),
});

const ResetPwd = () => {
  const searchParams = useSearchParams();

  const id = String(searchParams.get("token") || "");

  const { isError, isLoading, isFetching, refetch, data, error } =
    useGetResetTokenQuery(id, { skip: !id });

  const [reset, resetStatus] = useResetPasswordMutation();

  const router = useRouter();

  const errorResponse: ResponseType = (error as { data: { error: string } })
    ?.data;

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const {
    values: state,
    handleChange,
    errors,
    touched,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      updatePassword(values);
    },
  });

  const updatePassword = async (values: typeof initialValues) => {
    const res = await reset({ password: values.newPassword, token: id });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res.data;

      if (response?.success) {
        toast.success(
          "Password successfully update, please login with your new password"
        );

        router.replace("/login");
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  if (isLoading || isFetching) return <SectionLoader loading />;

  if (isError)
    return (
      <div>
        <p className="text-rose-600">{errorResponse?.error}</p>
      </div>
    );

  if (!!data?.data?.email) {
    return (
      <form onSubmit={handleSubmit}>
        <Input
          label={"New password"}
          required
          value={state["newPassword"]}
          onChange={handleChange}
          name="newPassword"
          onBlur={handleBlur}
          autoComplete="new-password webauthn"
          placeholder="Enter your new password"
          type="password"
          toggle
          dark
          error={(touched.newPassword && errors.newPassword) || ""}
        />
        <Input
          value={state["confirmPassword"]}
          required
          label={"Confirm New Password"}
          autoComplete="new-password webauthn"
          placeholder="Confirm your new password"
          type="password"
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          toggle
          dark
          error={(touched.confirmPassword && errors.confirmPassword) || ""}
        />
        <Button
          label="Set password"
          fullWidth
          brandedFont
          color="black"
          loading={resetStatus.isLoading}
        />
      </form>
    );
  }
  return <></>;
};

export default ResetPwd;
