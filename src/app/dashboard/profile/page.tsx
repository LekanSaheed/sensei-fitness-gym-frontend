"use client";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import UndertakingDocument from "@/components/documents/undertaking-document";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import SectionLoader from "@/components/SectionLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UploadProfilePictureModal from "@/components/UploadProfilePictureModal";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import useDebounceValue from "@/hooks/useDebounce";
import { useFetchUserAndLogin } from "@/hooks/useLogin";
import useStateReducer from "@/hooks/useStateReducer";
import useUser from "@/hooks/useUser";
import { actions } from "@/redux";
import { useCheckUsernameQuery } from "@/redux/api-slices/auth.slice";
import {
  useGetCheckInAnalyticsQuery,
  useGetSubscriptionsHistoryInfiniteQuery,
} from "@/redux/api-slices/subscription.slice";
import {
  useUpdateNotificationPreferencesMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
} from "@/redux/api-slices/user.slice";
import { Switch } from "@/components/ui/switch";
import { ErrorResponse } from "@/types";
import IUser from "@/types/User";
import {
  collocateMemberName,
  getInitials,
  isFetchBaseQueryError,
} from "@/utils";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useFormik } from "formik";
import {
  ArrowRight2,
  DocumentText,
  Edit,
  Icon,
  Lock1,
  LogoutCurve,
  Notification,
  UserEdit,
} from "iconsax-react";
import SectionTitle from "@/components/dashboard/SectionTitle";
import CheckInPassCard from "@/components/dashboard/CheckInPassCard";
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
    profilePictureModal: false,
  });

  const actions: {
    label: string;
    description: string;
    id: keyof typeof state;
    icon: Icon;
  }[] = [
    {
      label: "Update profile details",
      description: "Name and username",
      id: "profileUpdateModal",
      icon: UserEdit,
    },
    {
      label: "Change password",
      description: "Keep your account secure",
      id: "passwordUpdateModal",
      icon: Lock1,
    },
    {
      label: "My Undertaking Documents",
      description: "Signed with each plan",
      id: "undertakingDocsModal",
      icon: DocumentText,
    },
  ];

  const analytics = useGetCheckInAnalyticsQuery(null);

  const stats = [
    {
      label: "Check-ins",
      value: analytics.isLoading
        ? "-"
        : analytics.data?.data?.totalCheckIns ?? 0,
    },
    { label: "Plan", value: user?.hasActiveSub ? "Active" : "None" },
    {
      label: "Reg. fee",
      value: user?.registrationFeePaid ? "Paid" : "Unpaid",
    },
  ];

  return (
    <div className="flex flex-col gap-5 pt-2">
      <section className="relative overflow-hidden rounded-[24px] bg-default-black text-white p-5 dark:border dark:border-border">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-default/40 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <button
            onClick={() => handleStateChange({ profilePictureModal: true })}
            aria-label="Change profile picture"
            className="relative shrink-0 rounded-full"
          >
            <Avatar className="size-[84px] ring-2 ring-default ring-offset-2 ring-offset-default-black">
              <AvatarImage src={user?.profile_picture} />
              <AvatarFallback className="!bg-white/10 text-white text-[24px]">
                {getInitials(memberName)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 size-8 rounded-full bg-default border-2 border-default-black inline-flex items-center justify-center">
              <Edit color="var(--color-white)" size={14} />
            </span>
          </button>
          <div className="min-w-0">
            <h1 className="font-league uppercase text-[30px] leading-none truncate">
              {memberName}
            </h1>
            <p className="text-[13px] text-white/70 truncate mt-1">
              {user?.email}
            </p>
            <p className="text-[12px] text-default-tertiary">
              @{user?.username}
            </p>
          </div>
        </div>
        <dl className="relative grid grid-cols-3 gap-2 mt-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[14px] bg-white/[0.06] border border-white/10 px-3 py-2.5"
            >
              <dd className="font-league text-[24px] leading-none">
                {stat.value}
              </dd>
              <dt className="text-[10px] uppercase tracking-wide text-white/60 mt-1">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <SectionTitle>Check-in pass</SectionTitle>
        <CheckInPassCard />
      </section>

      <section>
        <SectionTitle>Account</SectionTitle>
        <ul className="rounded-[20px] bg-white border border-gray-200/70 divide-y divide-gray-200/70 dark:bg-card dark:border-border dark:divide-border">
          {actions.map((action) => {
            return (
              <li key={action.id}>
                <button
                  onClick={() => handleStateChange({ [action.id]: true })}
                  className="w-full flex items-center gap-3 p-4 text-left transition active:bg-gray-50 dark:active:bg-secondary"
                >
                  <span className="size-10 shrink-0 rounded-[12px] bg-default/10 inline-flex items-center justify-center">
                    {React.createElement(action.icon, {
                      size: 20,
                      color: "var(--color-default)",
                      variant: "Bold",
                    })}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-[14px]">
                      {action.label}
                    </span>
                    <span className="block text-[12px] text-gray-500 dark:text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  <ArrowRight2
                    size={16}
                    color="var(--color-secondary-foreground)"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <SectionTitle>Notifications</SectionTitle>
        <ActivityRemindersToggle />
      </section>

      <button
        onClick={() => handleStateChange({ logoutModal: true })}
        className="w-full flex items-center justify-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/5 py-3.5 text-[15px] font-semibold text-rose-600 transition active:scale-[0.98] dark:text-rose-400"
      >
        <LogoutCurve size={18} color="currentColor" />
        Logout
      </button>
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
      <UploadProfilePictureModal
        open={state.profilePictureModal}
        setOpen={(bool) => handleStateChange({ profilePictureModal: bool })}
      />
    </div>
  );
};

const ActivityRemindersToggle = () => {
  const user = useUser();

  const [update, updateStatus] = useUpdateNotificationPreferencesMutation();

  const { fetchUserAndLogin } = useFetchUserAndLogin();

  const enabled = user?.notificationPreferences?.activityReminders !== false;

  const toggle = async (checked: boolean) => {
    const res = await update({ activityReminders: checked });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else if (res.data?.success) {
      toast.success(
        checked ? "Activity reminders turned on" : "Activity reminders turned off"
      );

      fetchUserAndLogin();
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <label className="rounded-[20px] bg-white border border-gray-200/70 p-4 flex items-center gap-3 cursor-pointer dark:bg-card dark:border-border">
      <span className="size-10 shrink-0 rounded-[12px] bg-default/10 inline-flex items-center justify-center">
        <Notification size={20} color="var(--color-default)" variant="Bold" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px]">Activity reminder emails</p>
        <p className="text-[12px] text-gray-500 dark:text-muted-foreground">
          Get a reminder when you haven&apos;t checked in for a while
        </p>
      </div>
      <Switch
        checked={enabled}
        disabled={updateStatus.isLoading}
        onCheckedChange={toggle}
      />
    </label>
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
          icon={DocumentText}
          size="lg"
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

export const UpdatePassword = ({
  setOpen,
}: {
  setOpen?: (bool: boolean) => void;
}) => {
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
        if (setOpen) {
          setOpen(false);
        }

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
  );
};
const UpdatePasswordModal: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  return (
    <Modal open={open} setOpen={setOpen} title="Change Password">
      <UpdatePassword setOpen={setOpen} />
    </Modal>
  );
};

type FieldsToEdit = Pick<IUser, "firstname" | "lastname" | "username">;

type Field = keyof FieldsToEdit;

export const UpdateProfile = ({
  includeUsername,
  setOpen,
}: {
  includeUsername?: boolean;
  setOpen?: (bool: boolean) => void;
}) => {
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

        if (setOpen) {
          setOpen(false);
        }
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  return (
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
      {includeUsername && (
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
      )}
      <Button
        disabled={disabled}
        label="Update Details"
        fullWidth
        color="black"
        loading={updateStatus.isLoading}
      />
    </form>
  );
};

const UpdateProfileDetails: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  return (
    <Modal title="Update Profile Details" open={open} setOpen={setOpen}>
      <UpdateProfile includeUsername />
    </Modal>
  );
};

export default ProfilePage;
