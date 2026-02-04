"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import Select, { SelectDropdownOption } from "@/components/select";
import Spinner from "@/components/Spinner";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { DASHBOARD, SIGNUP } from "@/constants/routes";
import useDebounceValue from "@/hooks/useDebounce";
import { useFetchUserAndLogin } from "@/hooks/useLogin";
import { actions } from "@/redux";
import {
  useCheckUsernameQuery,
  useCreateAccountMutation,
  useGetCountriesQuery,
  useGetSessionQuery,
} from "@/redux/api-slices/auth.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { useFormik } from "formik";
import { CloseCircle, TickCircle } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const Page = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("token") || "";

  const [create, createStatus] = useCreateAccountMutation();

  const { fetchUserAndLogin, loading } = useFetchUserAndLogin();

  const router = useRouter();

  const validationSchema = yup.object({
    firstname: yup
      .string()
      .min(2)
      .max(30)
      .required("Your first name is required")
      .trim(),
    lastname: yup
      .string()
      .min(2)
      .max(30)
      .required("Your last name is required")
      .trim(),
    username: yup
      .string()
      .min(3)
      .max(20)
      .required("Your user name is required")
      .trim(),
    phoneNumber: yup.string().max(15).required("Your phone number is required"),
    password: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Must include uppercase, lowercase, number, and special character",
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
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  };

  const [countryCode, setCountryCode] = useState<SelectDropdownOption | null>(
    null,
  );

  const createAccount = async (data: typeof initV) => {
    if (!countryCode) return toast.error("Please select a country code");

    const { confirmPassword, phoneNumber, ...payload } = data;

    const newPhone = `${countryCode?.value}${phoneNumber}`;

    const res = await create({
      ...payload,
      session_id: id,
      phoneNumber: newPhone,
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        const token = response?.data?.token;

        fetchUserAndLogin(token!, () => {
          router.push(DASHBOARD);
        });
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  const {
    handleSubmit,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues: initV,
    validationSchema,
    onSubmit(values, formikHelpers) {
      createAccount(values);
    },
  });

  const { isLoading, isFetching, isError, refetch, data } =
    useGetSessionQuery(id);

  const email = data?.data?.email;

  const debouncedUsername = useDebounceValue(values.username, 500);

  const checkUsernameQuery = useCheckUsernameQuery(debouncedUsername, {
    skip: !debouncedUsername,
  });

  const usernameCheckLoading =
    checkUsernameQuery.isLoading || checkUsernameQuery.isFetching;

  const usernameCheckError = checkUsernameQuery.isError;

  const usernameIsAvailable = checkUsernameQuery?.data?.data?.isAvailable;

  const disabled = usernameCheckError || !usernameIsAvailable;

  const getCountriesQuery = useGetCountriesQuery(null);

  const countries = getCountriesQuery.data || [];

  const countryCodeOptions: SelectDropdownOption[] = countries.map(
    (country) => {
      const suffixes = country?.idd?.suffixes;

      const countryCode = `${country?.idd?.root}${
        suffixes?.length === 1 ? suffixes[0] : ""
      }`;
      return {
        label: countryCode,
        value: countryCode,
        img: country?.flags?.png || country?.flags?.png,
      };
    },
  );

  useEffect(() => {
    if (!countryCode && countryCodeOptions.length) {
      const defaultCountry = countryCodeOptions.find((c) => c.value === "+234");

      if (defaultCountry) {
        setCountryCode(defaultCountry);
      }
    }
  }, [countryCodeOptions, countryCode]);

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
            Invalid registration link, please get a valid registration link at
            the signup page
          </p>
          <Link href={SIGNUP}>
            <Button label="Get new link" variant="outlined" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input dark label={"Email"} defaultValue={email} disabled />
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
      />
      <div className="mb-4">
        <div className="flex gap-2  items-end">
          <div className="basis-[30%]">
            <Select
              containerClassName="!rounded-[8px]"
              selected={countryCode!}
              onSelect={(o) => setCountryCode(o)}
              remove_margin
              options={countryCodeOptions}
              removeDropdownIcon
              placeholder="code"
              label="Phone Number"
            />
          </div>
          <div className="flex-1 basis-[70%]">
            <Input
              remove_margin
              value={values.phoneNumber}
              inputMode="numeric"
              type="number"
              required
              onChange={(e) => setFieldValue("phoneNumber", e.target.value)}
              onBlur={handleBlur}
              name="phoneNumber"
            />
          </div>
        </div>
        {touched.phoneNumber && errors.phoneNumber && (
          <p className="text-[10px] mt-1 text-rose-500 tracking-n-2">
            {errors.phoneNumber}
          </p>
        )}
      </div>
      <Input
        label={"Username"}
        error={
          usernameCheckError
            ? "Could not username availability, please retry"
            : touched.username && !usernameIsAvailable
              ? "Username is not available"
              : (touched.username && errors.username) || ""
        }
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        name="username"
        placeholder="username"
        appendRight={
          usernameIsAvailable ? (
            <TickCircle
              variant="Bold"
              color="var(--color-emerald-500)"
              size={22}
              className="mr-3"
            />
          ) : !usernameIsAvailable &&
            touched.username &&
            !usernameCheckLoading ? (
            <CloseCircle
              color="var(--color-rose-500)"
              className="mr-3"
              variant="Bold"
              size={22}
            />
          ) : (
            ""
          )
        }
        info={
          usernameCheckLoading ? (
            "Checking username availability..."
          ) : usernameIsAvailable ? (
            <span className="text-emerald-600">Username is available</span>
          ) : (
            ""
          )
        }
      />
      <Input
        label={"Password"}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        type="password"
        name="password"
        toggle
        placeholder="Password"
        error={(touched.password && errors.password) || ""}
        dark
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
        dark
        error={(touched.confirmPassword && errors.confirmPassword) || ""}
      />
      <Button
        loading={loading || createStatus.isLoading}
        type="submit"
        label="Create Account"
        disabled={disabled}
        fullWidth
      />
    </form>
  );
};

export default Page;
