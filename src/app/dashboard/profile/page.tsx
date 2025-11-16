"use client";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import UndertakingDocument from "@/components/documents/undertaking-document";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import SectionLoader from "@/components/SectionLoader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import useDebounceValue from "@/hooks/useDebounce";
import { useFetchUserAndLogin } from "@/hooks/useLogin";
import useStateReducer from "@/hooks/useStateReducer";
import useUser from "@/hooks/useUser";
import { actions } from "@/redux";
import { useCheckUsernameQuery } from "@/redux/api-slices/auth.slice";
import { useGetSubscriptionsHistoryInfiniteQuery } from "@/redux/api-slices/subscription.slice";
import {
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "@/redux/api-slices/user.slice";
import { ErrorResponse } from "@/types";
import IUser from "@/types/User";
import {
  collocateMemberName,
  getInitials,
  isFetchBaseQueryError,
} from "@/utils";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useFormik } from "formik";
import { ArrowRight2, LogoutCurve } from "iconsax-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { FunctionComponent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const ProfilePage = () => {
  const user = useUser();

  const memberName = collocateMemberName(user!);

  const { handleStateChange, state } = useStateReducer({
    profileUpdateModal: false,
    passwordUpdateModal: false,
    logoutModal: false,
    undertakingDocsModal: false,
  });

  const actions: { label: string; id: keyof typeof state }[] = [
    { label: "Update profile details", id: "profileUpdateModal" },
    { label: "Change password", id: "passwordUpdateModal" },
    { label: "My Undertaking Documents", id: "undertakingDocsModal" },
  ];

  return (
    <div>
      <div className="flex bg-white p-4 rounded-[10px] mb-4 dark:bg-card">
        <Avatar className="size-[70px] mr-3">
          <AvatarFallback className=" border border-gray-400 !bg-white text-[20px] dark:!bg-accent dark:border-border">
            {getInitials(memberName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-[20px] tracking-tight">
            {memberName}
          </h1>
          <p className="text-[14px] text-gray-400">{user?.email}</p>
          <p className="text-[12px] text-default">@{user?.username}</p>
        </div>
      </div>
      <ul className="bg-white p-2 mb-4 dark:bg-card">
        {actions.map((action, id) => {
          return (
            <li
              onClick={() => handleStateChange({ [action.id]: true })}
              key={id}
              className="flex cursor-pointer justify-between items-center px-2 py-4 border-b last:border-b-0 dark:border-b-sidebar-border"
            >
              {action.label}{" "}
              <ArrowRight2
                size={16}
                color="var(--color-secondary-foreground)"
              />
            </li>
          );
        })}
      </ul>
      <Button
        onClick={() => handleStateChange({ logoutModal: true })}
        size="lg"
        label="Logout"
        fullWidth
        color="black"
      />
      <UpdateProfileDetails
        open={state.profileUpdateModal}
        setOpen={(bool) => handleStateChange({ profileUpdateModal: bool })}
      />
      <UpdatePasswordModal
        open={state.passwordUpdateModal}
        setOpen={(bool) => handleStateChange({ passwordUpdateModal: bool })}
      />
      <LogoutModal
        open={state.logoutModal}
        setOpen={(bool) => handleStateChange({ logoutModal: bool })}
      />
      <UndertakingDocsModal
        open={state.undertakingDocsModal}
        setOpen={(bool) => handleStateChange({ undertakingDocsModal: bool })}
      />
    </div>
  );
};

const UndertakingDocsModal: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  const {
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
    data,
  } = useGetSubscriptionsHistoryInfiniteQuery({ limit: 24 });

  const subscriptions =
    data?.pages?.flatMap((p) => p?.data?.data || []).flat() || [];

  const loading = (isLoading || isFetching) && !isFetchingNextPage;

  const [selected, setSelected] = useState("");

  const selectedDocument = subscriptions.find((s) => s?._id === selected);

  const member = useUser();
  return (
    <Modal open={open} setOpen={setOpen} title="Undertaking Documents">
      <SectionLoader loading={loading} error={isError} refetch={refetch} />
      <div className="max-h-[600px] overflow-y-auto">
        {subscriptions.map((subscription) => {
          return (
            <div
              onClick={() => setSelected(subscription?._id)}
              key={subscription._id}
              className="mb-5 p-4 border  rounded-lg dark:bg-card"
            >
              <h1 className="text-[12px] font-semibold">
                {subscription?.planNameSnapshot}
              </h1>
              <p className="text-[10px] ">
                {moment(subscription?.startDate).format("llll")} -{" "}
                {moment(subscription?.endDate).format("llll")}
              </p>
            </div>
          );
        })}
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              label="Load More"
              loading={isFetchingNextPage}
              onClick={fetchNextPage}
              variant="outlined"
              color="black"
            />
          </div>
        )}
        <DialogModal
          open={!!selectedDocument}
          setOpen={() => setSelected("")}
          title={`Undertaking Document`}
        >
          <PDFViewer
            style={{ width: "100%", height: "60vh", marginBottom: "20px" }}
          >
            <UndertakingDocument
              duration={selectedDocument?.planDurationInDaysSnapshot || 0}
              planName={selectedDocument?.planNameSnapshot || ""}
              signature={
                selectedDocument?.signature || collocateMemberName(member)
              }
              date={selectedDocument?.createdAt || ""}
            />
          </PDFViewer>
          <PDFDownloadLink
            style={{ marginTop: "10px" }}
            document={
              <UndertakingDocument
                duration={selectedDocument?.planDurationInDaysSnapshot || 0}
                planName={selectedDocument?.planNameSnapshot || ""}
                signature={
                  selectedDocument?.signature || collocateMemberName(member)
                }
                date={selectedDocument?.createdAt || ""}
              />
            }
            fileName={`Sensei_fitness_undertaking_${moment(
              selectedDocument?.createdAt
            ).format("DD/MM/YYYY")}.pdf`}
          >
            <Button label="Download Document" fullWidth color="black" />
          </PDFDownloadLink>
        </DialogModal>
      </div>
    </Modal>
  );
};

const LogoutModal: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  const { logout } = actions["auth"];

  const dispatch = useDispatch();
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="pt-7">
        <div className="flex items-center justify-center size-[60px] rounded-full mx-auto mb-4 bg-rose-500/10 ">
          <LogoutCurve color="var(--color-rose-600)" size={30} />
        </div>
        <div className="text-center">
          <h1 className="font-bold text-[20px]">Logout?</h1>
          <p className="text-[14px] text-muted-foreground">
            Are you sure you want to logout of your account? You will be
            required to sign in again to access your account.
          </p>
        </div>
        <div className="flex gap-4 mt-7">
          <Button
            label="No, cancel"
            fullRadius
            color="black"
            fullWidth
            onClick={() => setOpen(false)}
          />
          <Button
            label="Yes, logout"
            fullRadius
            className="!bg-rose-500"
            fullWidth
            onClick={() => {
              dispatch(logout(null));
              setOpen(false);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

const validationSchema = yup.object({
  currentPassword: yup
    .string()
    .min(8, "Should be at least 8 characters")
    .required("Please enter your current password"),
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

const UpdatePasswordModal: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [update, updateStatus] = useUpdatePasswordMutation();

  const { logout } = actions["auth"];

  const dispatch = useDispatch();

  const router = useRouter();

  const updatePassword = async (values: typeof initialValues) => {
    const { confirmPassword, ...v } = values;
    const res = await update(v);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res.data;

      if (response?.success) {
        toast.success(
          "Password successfully update, please login with your new password"
        );
        setOpen(false);

        dispatch(logout(null));

        router.push("/login");
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
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

  return (
    <Modal open={open} setOpen={setOpen} title="Change Password">
      <form onSubmit={handleSubmit}>
        <Input
          required
          label={"Current Password"}
          type="password"
          name="currentPassword"
          autoComplete="new-password webauthn"
          placeholder="Enter your current password"
          value={state.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          toggle
          error={(touched.currentPassword && errors.currentPassword) || ""}
        />
        <Input
          required
          value={state["newPassword"]}
          onChange={handleChange}
          name="newPassword"
          onBlur={handleBlur}
          label={"New Password"}
          autoComplete="new-password webauthn"
          placeholder="Enter your new password"
          type="password"
          toggle
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
          error={(touched.confirmPassword && errors.confirmPassword) || ""}
        />
        <Button
          loading={updateStatus.isLoading}
          fullWidth
          label="Change Password"
          color="black"
        />
      </form>
    </Modal>
  );
};

type FieldsToEdit = Pick<IUser, "firstname" | "lastname" | "username">;

type Field = keyof FieldsToEdit;

const UpdateProfileDetails: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  const user = useUser();

  const { state, handleStateChange } = useStateReducer<FieldsToEdit>(
    {} as FieldsToEdit
  );

  const isCurrentUserName =
    user?.username?.toLowerCase() === state?.username?.toLowerCase() ||
    !state?.username;

  const debouncedUsername = useDebounceValue(state?.username, 500);

  const checkUsernameQuery = useCheckUsernameQuery(debouncedUsername, {
    skip: !debouncedUsername || isCurrentUserName,
  });

  const usernameCheckLoading =
    checkUsernameQuery.isLoading || checkUsernameQuery.isFetching;

  const usernameCheckError = checkUsernameQuery.isError;

  const usernameIsAvailable = checkUsernameQuery?.data?.data?.isAvailable;

  const getField = (field: Field) => {
    return field in state ? state[field] : (user && user[field]) || "";
  };

  const disabled =
    Object.entries(state).some((a) => !a[1]) ||
    Object.entries(state).length < 1 ||
    Object.entries(state).every(
      (entry) => entry[1] == user?.[entry[0] as Field]
    ) ||
    usernameCheckError ||
    usernameCheckLoading ||
    (!usernameIsAvailable && !isCurrentUserName);

  const [update, updateStatus] = useUpdateProfileMutation();

  const { fetchUserAndLogin, loading } = useFetchUserAndLogin();

  const updateProfile = async () => {
    const res = await update(state);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res.data;

      if (response?.success) {
        toast.success("Successfully updated");

        fetchUserAndLogin();

        setOpen(false);
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  return (
    <Modal title="Update Profile Details" open={open} setOpen={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateProfile();
        }}
      >
        <Input
          required
          value={getField("firstname")}
          onChange={(e) => handleStateChange({ firstname: e.target.value })}
          label={"First Name"}
          placeholder="First Name"
        />
        <Input
          required
          value={getField("lastname")}
          onChange={(e) => handleStateChange({ lastname: e.target.value })}
          label={"Last Name"}
          placeholder="Last Name"
        />
        <Input
          required
          value={getField("username")}
          onChange={(e) => handleStateChange({ username: e.target.value })}
          label={"Username"}
          error={
            usernameCheckLoading || isCurrentUserName
              ? ""
              : usernameCheckError
              ? "Could not username availability, please retry"
              : !usernameIsAvailable
              ? "Username is not available"
              : ""
          }
          info={
            isCurrentUserName ? (
              ""
            ) : usernameCheckLoading ? (
              "Checking username availability..."
            ) : usernameIsAvailable ? (
              <span className="text-emerald-600">Username is available</span>
            ) : (
              ""
            )
          }
          placeholder="@username"
        />
        <Button
          disabled={disabled}
          label="Update Details"
          fullWidth
          color="black"
          loading={updateStatus.isLoading}
        />
      </form>
    </Modal>
  );
};

export default ProfilePage;
