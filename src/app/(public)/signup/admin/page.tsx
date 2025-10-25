"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import Spinner from "@/components/Spinner";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { ADMIN_DASHBOARD } from "@/constants/routes";
import { useFetchUserAndLogin } from "@/hooks/useLogin";
import {
  useCreateAdminAccountMutation,
  useGetInvitationQuery,
} from "@/redux/api-slices/auth.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

const AdminSignupPage = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("token") || "";

  const validationSchema = yup.object({
    firstname: yup
      .string()
      .min(2)
      .max(30)
      .required("Your first name is required"),
    lastname: yup
      .string()
      .min(2)
      .max(30)
      .required("Your last name is required"),

    password: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Must contain upper, lower, number & special char"
      )
      .required("Your password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initV = {
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  };

  const router = useRouter();

  const { handleSubmit, values, touched, errors, handleBlur, handleChange } =
    useFormik({
      initialValues: initV,
      validationSchema,
      onSubmit(values, formikHelpers) {
        createAccount(values);
      },
    });

  const { isLoading, isFetching, isError, refetch, data, error } =
    useGetInvitationQuery(id);

  const email = data?.data?.email;

  const [create, createStatus] = useCreateAdminAccountMutation();

  const { fetchUserAndLogin, loading } = useFetchUserAndLogin();

  const createAccount = async (data: typeof initV) => {
    const { confirmPassword, ...payload } = data;
    const res = await create({ ...payload, invitation_id: id });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        const token = response?.data?.token;

        fetchUserAndLogin(token!, () => {
          router.push(ADMIN_DASHBOARD);
        });
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  if (isLoading || isFetching)
    return (
      <div className="h-[180px] flex  items-center justify-center">
        <Spinner className="text-[40px] text-default" />
      </div>
    );

  if (isError) {
    return (
      <div className="h-[180px] text-center flex  items-center justify-center">
        <div>
          <p className="text-[14px] mb-2 text-rose-600">
            {isFetchBaseQueryError(error)
              ? (error?.data as ErrorResponse)?.error
              : "This link is invalid"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input label={"Email"} defaultValue={email} disabled />
      <Input
        label={"First Name"}
        error={(touched.firstname && errors.firstname) || ""}
        value={values.firstname}
        onChange={handleChange}
        onBlur={handleBlur}
        name="firstname"
        placeholder="First Name"
      />
      <Input
        label={"Last Name"}
        error={(touched.lastname && errors.lastname) || ""}
        value={values.lastname}
        onChange={handleChange}
        onBlur={handleBlur}
        name="lastname"
        placeholder="Last Name"
        autoComplete="new-password"
      />

      <Input
        autoComplete="new-password"
        label={"Password"}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        type="password"
        name="password"
        toggle
        placeholder="Password"
        error={(touched.password && errors.password) || ""}
      />
      <Input
        label={"Confirm Password"}
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        type="password"
        name="confirmPassword"
        toggle
        placeholder="Password"
        error={(touched.confirmPassword && errors.confirmPassword) || ""}
      />
      <Button
        loading={loading || createStatus.isLoading}
        type="submit"
        label="Create Account"
        fullWidth
      />
    </form>
  );
};

export default AdminSignupPage;
