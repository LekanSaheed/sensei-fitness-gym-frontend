"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import Alert from "@/components/alert";
import Button from "@/components/button";
import SectionLoader from "@/components/SectionLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetCheckInsQuery,
  useGetMemberByIdQuery,
  UserWithSub,
  useWaiveRegistrationFeeMutation,
} from "@/redux/api-slices/admin.slice";
import { SubscriptionStatus } from "@/redux/api-slices/subscription.slice";
import { ErrorResponse } from "@/types";
import {
  collocateMemberName,
  getInitials,
  isFetchBaseQueryError,
} from "@/utils";
import moment from "moment";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const Member = () => {
  const { member } = useParams() as { member: string };

  const { data, isLoading, isFetching, refetch, isError } =
    useGetMemberByIdQuery({ id: member, includeSub: true });

  const loading = isLoading || isFetching;

  const memberDetails = data?.data || null;

  const subscription = memberDetails?.latestSubscription || null;

  const daysLeft = moment(subscription?.endDate).diff(moment(), "days");

  const statusClass: Record<SubscriptionStatus, string> = {
    expired: "bg-rose-500",
    canceled: "bg-gray-500",
    active: "bg-emerald-500",
  };

  const getCheckIn = useGetCheckInsQuery({ userId: member, page: 1, limit: 1 });

  const checkInLoading = getCheckIn.isLoading || getCheckIn.isFetching;

  const lastCheckIn = (getCheckIn?.data?.data?.data || [])[0];

  const [waive, waiveStatus] = useWaiveRegistrationFeeMutation();

  const waiveFee = async () => {
    const res = await waive({ userId: memberDetails?._id || "" });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || "Failed to waive registration fee");
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(
          response?.message || "Registration fee waived successfully"
        );
      } else {
        toast.error(response?.message || "Failed to waive registration fee");
      }
    }
  };
  return (
    <div>
      <SectionLoader loading={loading} error={isError} refetch={refetch} />

      {!loading && !isError && memberDetails && (
        <div className="bg-white rounded-[18px] border border-gray-200/80 px-5 md:px-7 py-2 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)]">
          <div className="border-b  flex items-center gap-2 py-4">
            <Avatar className="size-20 text-[25px]">
              <AvatarImage src={memberDetails?.profile_picture} />
              <AvatarFallback>
                {getInitials(collocateMemberName(memberDetails))}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold mb-1 text-[20px] leading-[100%]">
                {memberDetails?.firstname || ""} {memberDetails?.lastname || ""}
              </h1>

              <p className="text-[12px] text-gray-500">
                {memberDetails?.email}
              </p>
              <p className="text-[12px] text-default-secondary">
                @{memberDetails?.username}
              </p>
            </div>
          </div>
          <div className="py-4 border-b">
            <h1 className="text-[12px] text-gray-800 font-bold mb-2">
              Registration Fee Status
            </h1>

            <div className="flex justify-between gap-4">
              {memberDetails?.registrationFeePaid ? (
                <div className="inline-flex items-center bg-emerald-100 text-emerald-600 px-2 py-1 rounded-[5px] text-[12px] font-medium">
                  Registration Fee Paid
                </div>
              ) : (
                <div className="inline-flex items-center bg-rose-100 text-rose-600 px-2 py-1 rounded-[5px] text-[12px] font-medium">
                  Registration Fee Not Paid
                </div>
              )}
              {!memberDetails?.registrationFeePaid && (
                <Alert
                  onContinueClick={waiveFee}
                  loading={waiveStatus.isLoading}
                  alertTrigger={
                    <div>
                      <Button
                        permissions={["waive_registration_fee"]}
                        loading={waiveStatus.isLoading}
                        label="Waive Registration Fee"
                        color="black"
                      />
                    </div>
                  }
                  title="Waive registration fee"
                  description={`Are you sure you want to waive registration fee for ${collocateMemberName(
                    memberDetails
                  )}`}
                />
              )}
            </div>
            {memberDetails?.registrationFeePaid && (
              <div className="text-[10px] mt-1">
                {memberDetails?.registrationFeeWaivedBy ? (
                  <>
                    Waived by admin (
                    {memberDetails?.registrationFeeWaivedBy?.firstname || ""}{" "}
                    {memberDetails?.registrationFeeWaivedBy?.lastname || ""})
                  </>
                ) : (
                  <>Paid via payment gateway on first subscription</>
                )}
              </div>
            )}
          </div>
          <div className="py-4 border-b">
            <h1 className="text-[12px] text-gray-800 font-bold">
              Recent Subscription
            </h1>

            {subscription ? (
              <div className="p-4 border mt-2 rounded-[10px]">
                <h1 className="font-bold font-jakarta text-[14px] mb-1">
                  {subscription?.planNameSnapshot}
                  <span className="inline-flex items-center font-normal  ml-2 text-gray-600">
                    <span
                      className={`size-[6px] inline-block rounded-full mr-0.5 shrink-0 ${
                        statusClass[subscription?.status]
                      }`}
                    />
                    <span className="">{subscription.status}</span>
                  </span>
                </h1>
                {subscription?.includesTrainer && (
                  <p className="text-default-secondary border-default-secondary inline-block text-[12px] px-2 py-0.5 font-normal mb-2 border rounded-[4px]">
                    Includes Trainer
                  </p>
                )}
                <p className="text-[12px] text-gray-500">
                  Valid for {subscription?.planDurationInDaysSnapshot} day
                  {subscription?.planDurationInDaysSnapshot > 1
                    ? "s"
                    : ""} -{" "}
                  <span className="text-[12px] text-black font-medium">
                    {daysLeft > 0 ? daysLeft : 0} day{daysLeft > 1 ? "s" : ""}{" "}
                    left
                  </span>
                </p>
              </div>
            ) : (
              <div className="font-light text-[13px] py-3">
                {memberDetails?.firstname} has not subscribed to any plan yet
              </div>
            )}
          </div>
          <MemberActivitySection member={memberDetails} />
          <div className="py-4 text-[13px]">
            <h1 className="text-[12px] text-gray-800 font-bold">
              Last Check-In
            </h1>
            {lastCheckIn && !checkInLoading && !getCheckIn.isError && (
              <div className="p-4 border mt-2 rounded-[10px] text-[14px]">
                {lastCheckIn?.checkInType === "admin"
                  ? `Checked in by ${
                      lastCheckIn?.checkedInBy?.firstname || ""
                    } ${lastCheckIn?.checkedInBy?.lastname || ""}, ${moment(
                      lastCheckIn?.createdAt
                    ).calendar()}`
                  : `Checked in ${moment(lastCheckIn?.createdAt).calendar()}`}
              </div>
            )}
            {!lastCheckIn && !checkInLoading && !getCheckIn.isError && (
              <div className="mt-2">
                {memberDetails?.firstname} has never checked in
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const formatDays = (days?: number | null) =>
  days === null || days === undefined
    ? null
    : days === 0
    ? "Today"
    : `${days} day${days > 1 ? "s" : ""} ago`;

const MemberActivitySection = ({ member }: { member: UserWithSub }) => {
  const activity = member?.activity;

  const reasonLabel: Record<string, string> = {
    "check-in": "after a check-in",
    login: "after logging in",
    scheduled: "due to inactivity",
  };

  const stats: { label: string; value: React.ReactNode; sub?: string | null }[] =
    [
      {
        label: "Last Check-in",
        value: member?.lastCheckInAt
          ? moment(member.lastCheckInAt).format("ll")
          : "Never checked in",
        sub: formatDays(activity?.daysSinceLastCheckIn),
      },
      {
        label: "Last Login",
        value: member?.lastLoginAt
          ? moment(member.lastLoginAt).format("ll")
          : "No login recorded",
        sub: formatDays(activity?.daysSinceLastLogin),
      },
      {
        label: "In Zone Since",
        value: activity?.zoneEnteredAt
          ? moment(activity.zoneEnteredAt).format("ll")
          : "N/A",
        sub: activity?.zoneEnteredAt
          ? moment(activity.zoneEnteredAt).fromNow()
          : null,
      },
      {
        label: "Previous Zone",
        value: activity?.previousZone ? (
          <ActivityZoneBadge zone={activity.previousZone} />
        ) : (
          "N/A"
        ),
      },
    ];

  return (
    <div className="py-4 border-b">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h1 className="text-[12px] text-gray-800 font-bold">Activity Zone</h1>
        <ActivityZoneBadge zone={activity?.zone} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 border rounded-[10px]">
            <p className="text-[11px] text-gray-500 mb-1">{stat.label}</p>
            <div className="text-[13px] font-medium">{stat.value}</div>
            {stat.sub && (
              <p className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>

      {!!activity?.history?.length && (
        <div className="mt-3">
          <p className="text-[11px] text-gray-500 mb-1">Recent zone changes</p>
          <ul className="text-[12px]">
            {activity.history.map((h) => (
              <li
                key={h._id}
                className="flex flex-wrap items-center gap-1 py-1 border-b last:border-b-0"
              >
                <span className="text-gray-500 mr-1">
                  {moment(h.createdAt).format("ll")}
                </span>
                {h.from ? <ActivityZoneBadge zone={h.from} /> : "-"}
                <span>→</span>
                <ActivityZoneBadge zone={h.to} />
                <span className="text-gray-500">
                  {reasonLabel[h.reason] || ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!activity?.inactivityFeedback?.length && (
        <div className="mt-3">
          <p className="text-[11px] text-gray-500 mb-1">
            Reasons given for inactivity
          </p>
          <ul className="grid gap-2">
            {activity.inactivityFeedback.map((f) => (
              <li key={f._id} className="p-3 border rounded-[10px] text-[12px]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[13px]">
                    {f.reasonLabel}
                  </span>
                  <span className="text-gray-500">
                    {moment(f.updatedAt).format("ll")}
                  </span>
                </div>
                {f.note && (
                  <p className="mt-1 text-gray-700 whitespace-pre-line break-words">
                    &ldquo;{f.note}&rdquo;
                  </p>
                )}
                <p className="mt-1 text-gray-500 flex flex-wrap items-center gap-1">
                  From the reminder{" "}
                  {f.reminderKind === "after" ? "after entering" : "before"}{" "}
                  <ActivityZoneBadge zone={f.reminderZone} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {member?.notificationPreferences?.activityReminders === false && (
        <p className="text-[11px] text-gray-500 mt-2">
          This member has turned off activity reminder emails.
        </p>
      )}
    </div>
  );
};

export default Member;
