"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import Alert from "@/components/alert";
import Button from "@/components/button";
import SectionLoader from "@/components/SectionLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MEMBERS } from "@/constants/routes";
import {
  useGetCheckInsQuery,
  useGetMemberByIdQuery,
  UserWithSub,
  useWaiveRegistrationFeeMutation,
} from "@/redux/api-slices/admin.slice";
import {
  SubscriptionStatus,
  useGetPlansQuery,
} from "@/redux/api-slices/subscription.slice";
import { ErrorResponse } from "@/types";
import {
  collocateMemberName,
  getInitials,
  isFetchBaseQueryError,
} from "@/utils";
import FormatNumber from "@/utils/format-number";
import { cldImage } from "@/utils/images";
import {
  ArrowRight2,
  Calendar,
  Call,
  Clock,
  LocationTick,
  Receipt21,
  Sms,
  TickCircle,
  UserTick,
} from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { ReactNode, useState } from "react";
import toast from "react-hot-toast";

const STATUS_STYLE: Record<SubscriptionStatus, { pill: string; dot: string }> = {
  active: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  expired: { pill: "bg-rose-50 text-rose-600 border-rose-200", dot: "bg-rose-500" },
  canceled: { pill: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" },
  scheduled: { pill: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
};

/** White card used for every section on this page */
const Panel = ({
  title,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={`bg-white rounded-[18px] border border-gray-200/80 p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between gap-3 mb-4">
        {title && <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>}
        {action}
      </div>
    )}
    {children}
  </section>
);

const formatDays = (days?: number | null) =>
  days === null || days === undefined
    ? null
    : days === 0
    ? "Today"
    : `${days} day${days > 1 ? "s" : ""} ago`;

const Member = () => {
  const { member } = useParams() as { member: string };

  const { data, isLoading, isFetching, refetch, isError } =
    useGetMemberByIdQuery({ id: member, includeSub: true });

  const memberDetails = data?.data || null;

  const getCheckIn = useGetCheckInsQuery({ userId: member, page: 1, limit: 1 });

  const checkInLoading = getCheckIn.isLoading || getCheckIn.isFetching;

  const lastCheckIn = (getCheckIn?.data?.data?.data || [])[0];

  const totalCheckIns = getCheckIn?.data?.data?.paginationInfo?.totalItems;

  const [waive, waiveStatus] = useWaiveRegistrationFeeMutation();

  /** Off: waive (old member, nothing logged). On: record a desk payment. */
  const [recordPayment, setRecordPayment] = useState(false);

  // The current fee, from the same public endpoint members pay through
  const registrationFee = useGetPlansQuery(null).data?.data?.registrationFee;

  const waiveFee = async () => {
    const res = await waive({
      userId: memberDetails?._id || "",
      recordPayment,
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || "Failed to waive registration fee");
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(
          response?.message || "Registration fee waived successfully"
        );

        setRecordPayment(false);
      } else {
        toast.error(response?.message || "Failed to waive registration fee");
      }
    }
  };

  if (!memberDetails) {
    return (
      <SectionLoader
        loading={isLoading || isFetching}
        error={isError || (!isLoading && !isFetching)}
        refetch={refetch}
      />
    );
  }

  const name = collocateMemberName(memberDetails);

  const firstname = memberDetails.firstname || "This member";

  const subscription = memberDetails.latestSubscription || null;

  const status = subscription?.status;

  const totalDays = subscription?.planDurationInDaysSnapshot || 0;

  const daysLeft = subscription
    ? Math.max(0, moment(subscription.endDate).diff(moment(), "days"))
    : 0;

  const usedPct =
    subscription && totalDays
      ? Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100))
      : 0;

  const activatedBy =
    subscription && typeof subscription.activatedBy === "object"
      ? subscription.activatedBy
      : null;

  const quickStats: { label: string; value: ReactNode; sub?: ReactNode }[] = [
    {
      label: "Plan",
      value: subscription ? (status === "active" ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : "Not active") : "No plan",
      sub: subscription?.planNameSnapshot || "Never subscribed",
    },
    {
      label: "Total check-ins",
      value: checkInLoading && totalCheckIns === undefined ? "…" : totalCheckIns ?? 0,
      sub: memberDetails.lastCheckInAt
        ? `Last ${moment(memberDetails.lastCheckInAt).fromNow()}`
        : "Never checked in",
    },
    {
      label: "Last login",
      value: memberDetails.lastLoginAt ? moment(memberDetails.lastLoginAt).format("D MMM") : "—",
      sub: formatDays(memberDetails.activity?.daysSinceLastLogin) || "No login recorded",
    },
    {
      label: "Member since",
      value: moment(memberDetails.createdAt).format("MMM YYYY"),
      sub: moment(memberDetails.createdAt).fromNow(),
    },
  ];

  return (
    <div className={`flex flex-col gap-4 transition ${isFetching ? "opacity-70" : ""}`}>
      {/* Profile header */}
      <section className="relative overflow-hidden rounded-[22px] bg-default-black text-white p-5 md:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-default/30 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <Avatar className="size-20 md:size-24 ring-4 ring-default/40 shrink-0">
            <AvatarImage
              src={cldImage(memberDetails.profile_picture, { width: 240, height: 240 })}
              className="object-cover"
            />
            <AvatarFallback className="bg-default/20 text-default-tertiary text-[26px] font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[24px] md:text-[28px] font-bold leading-tight tracking-tight break-words">
                {name}
              </h1>
              {memberDetails.disabled && (
                <span className="rounded-full bg-rose-500/20 border border-rose-400/40 px-2.5 py-0.5 text-[11px] font-semibold text-rose-200">
                  Account disabled
                </span>
              )}
            </div>
            <p className="text-[13px] text-default-tertiary">@{memberDetails.username}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/75">
              <a href={`mailto:${memberDetails.email}`} className="inline-flex items-center gap-1.5 hover:text-white break-all">
                <Sms size={15} color="currentColor" />
                {memberDetails.email}
              </a>
              {memberDetails.phoneNumber && (
                <a href={`tel:${memberDetails.phoneNumber}`} className="inline-flex items-center gap-1.5 hover:text-white">
                  <Call size={15} color="currentColor" />
                  {memberDetails.phoneNumber}
                </a>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={15} color="currentColor" />
                Joined {moment(memberDetails.createdAt).format("D MMM YYYY")}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
            <ActivityZoneBadge zone={memberDetails.activity?.zone} />
            {subscription ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2 py-1 text-[12px] font-medium capitalize ${STATUS_STYLE[subscription.status].pill}`}
              >
                <span className={`size-[6px] rounded-full ${STATUS_STYLE[subscription.status].dot}`} />
                Plan {subscription.status}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-[5px] border border-white/20 px-2 py-1 text-[12px] text-white/70">
                No plan
              </span>
            )}
            {subscription?.includesTrainer && (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-default/50 bg-default/15 px-2 py-1 text-[12px] font-medium text-default-tertiary">
                <UserTick size={13} color="currentColor" variant="Bold" />
                With trainer
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-white rounded-[16px] border border-gray-200/80 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className="text-[20px] font-black tracking-tight mt-1 tabular-nums truncate">{s.value}</p>
            {s.sub && <p className="text-[12px] text-gray-500 truncate">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
        {/* Main column */}
        <div className="flex flex-col gap-4 min-w-0">
          <Panel
            title="Current plan"
            action={
              <Link
                href={`${MEMBERS}/${memberDetails._id}/subscriptions?name=${encodeURIComponent(name)}`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-default hover:underline"
              >
                Plan history <ArrowRight2 size={13} color="currentColor" />
              </Link>
            }
          >
            {subscription ? (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[20px] font-bold tracking-tight">{subscription.planNameSnapshot}</p>
                    <p className="text-[12px] text-gray-500">
                      {totalDays} day{totalDays === 1 ? "" : "s"} plan
                      {subscription.includesTrainer ? " · includes a trainer" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[28px] font-black leading-none tabular-nums">
                      {status === "active" ? daysLeft : 0}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mt-1">days left</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${status === "active" ? "bg-default" : "bg-gray-300"}`}
                      style={{ width: `${status === "active" ? usedPct : 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
                    <span>Started {moment(subscription.startDate).format("D MMM YYYY")}</span>
                    <span>
                      {status === "active" ? "Ends" : "Ended"} {moment(subscription.endDate).format("D MMM YYYY")}
                    </span>
                  </div>
                </div>

                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t">
                  <div>
                    <dt className="text-[11px] text-gray-500">Status</dt>
                    <dd className="text-[13px] font-semibold capitalize">{subscription.status}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-gray-500">Paid via</dt>
                    <dd className="text-[13px] font-semibold">
                      {subscription.paymentMode === "admin" ? "Front desk" : subscription.paymentMode === "gateway" ? "Online" : subscription.paymentMode || "—"}
                    </dd>
                  </div>
                  {activatedBy && (
                    <div>
                      <dt className="text-[11px] text-gray-500">Activated by</dt>
                      <dd className="text-[13px] font-semibold truncate">
                        {activatedBy.firstname} {activatedBy.lastname}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <div className="rounded-[14px] border border-dashed border-gray-300 p-6 text-center">
                <Receipt21 size={26} color="var(--color-default)" variant="Bulk" className="mx-auto mb-2" />
                <p className="font-semibold text-[14px]">No plan yet</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{firstname} hasn&apos;t subscribed to any plan.</p>
              </div>
            )}
          </Panel>

          {memberDetails.upcomingSubscription && (
            <Panel title="Next plan">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[16px] font-bold tracking-tight">
                    {memberDetails.upcomingSubscription.planNameSnapshot}
                  </p>
                  <p className="text-[12px] text-gray-500">
                    {memberDetails.upcomingSubscription.planDurationInDaysSnapshot} day
                    {memberDetails.upcomingSubscription.planDurationInDaysSnapshot === 1 ? "" : "s"}
                    {memberDetails.upcomingSubscription.includesTrainer ? " · includes a trainer" : ""}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2 py-1 text-[12px] font-medium ${STATUS_STYLE.scheduled.pill}`}>
                  <span className={`size-[6px] rounded-full ${STATUS_STYLE.scheduled.dot}`} />
                  Scheduled
                </span>
              </div>
              <p className="text-[12px] text-gray-600 mt-3">
                Starts {moment(memberDetails.upcomingSubscription.startDate).format("ddd, D MMM YYYY")} and runs until{" "}
                {moment(memberDetails.upcomingSubscription.endDate).format("D MMM YYYY")}, right after the current plan.
              </p>
            </Panel>
          )}

          <MemberActivitySection member={memberDetails} />
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-4 min-w-0">
          <Panel title="Registration fee">
            {memberDetails.registrationFeePaid ? (
              <div className="flex items-start gap-3">
                <span className="size-9 rounded-full bg-emerald-50 inline-flex items-center justify-center shrink-0">
                  <TickCircle size={20} color="var(--color-emerald-500)" variant="Bold" />
                </span>
                <div className="text-[13px]">
                  <p className="font-semibold">Settled</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {memberDetails.registrationFeeWaivedBy && memberDetails.registrationFeePayment ? (
                      <>
                        Paid at the desk ({FormatNumber.ngnAmount(memberDetails.registrationFeePayment.amount)}), recorded by{" "}
                        {memberDetails.registrationFeeWaivedBy.firstname} {memberDetails.registrationFeeWaivedBy.lastname} on{" "}
                        {moment(memberDetails.registrationFeePayment.createdAt).format("ll")}
                      </>
                    ) : memberDetails.registrationFeeWaivedBy ? (
                      <>
                        Waived by {memberDetails.registrationFeeWaivedBy.firstname} {memberDetails.registrationFeeWaivedBy.lastname}. No
                        payment recorded.
                      </>
                    ) : (
                      <>Paid online with their first subscription</>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-3">
                  <span className="size-9 rounded-full bg-rose-50 inline-flex items-center justify-center shrink-0 text-rose-500 font-bold">
                    !
                  </span>
                  <div className="text-[13px]">
                    <p className="font-semibold">Not paid</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">
                      {firstname} can&apos;t be given a plan at the desk until this is settled.
                    </p>
                  </div>
                </div>
                <Alert
                  onContinueClick={waiveFee}
                  loading={waiveStatus.isLoading}
                  alertTrigger={
                    <div className="mt-4">
                      <Button
                        permissions={["waive_registration_fee"]}
                        loading={waiveStatus.isLoading}
                        label="Waive Registration Fee"
                        color="black"
                        fullWidth
                        fullRadius
                      />
                    </div>
                  }
                  title="Waive registration fee"
                  description={`Mark the registration fee as settled for ${name}.`}
                  continueLabel={recordPayment ? "Record payment" : "Waive fee"}
                >
                  <label className="flex items-start gap-3 rounded-[14px] border border-gray-200 p-3.5 cursor-pointer text-left has-[:checked]:border-default has-[:checked]:bg-default/5">
                    <input
                      type="checkbox"
                      checked={recordPayment}
                      onChange={(e) => setRecordPayment(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-[var(--color-default)]"
                    />
                    <span>
                      <span className="block text-[13px] font-semibold">Save a payment record</span>
                      <span className="block text-[12px] text-gray-500 mt-0.5">
                        {recordPayment
                          ? `A ${registrationFee ? FormatNumber.ngnAmount(registrationFee) : "registration fee"} payment will be added to payment logs and revenue.`
                          : "Leave unticked for old members who don't need to pay again. Nothing is added to payments or revenue."}
                      </span>
                    </span>
                  </label>
                </Alert>
              </div>
            )}
          </Panel>

          <Panel
            title="Last check-in"
            action={
              <Link
                href={`${MEMBERS}/${memberDetails._id}/check-ins?name=${encodeURIComponent(name)}`}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-default hover:underline"
              >
                All check-ins <ArrowRight2 size={13} color="currentColor" />
              </Link>
            }
          >
            {checkInLoading && !lastCheckIn ? (
              <div className="h-12 rounded-[12px] bg-gray-100 animate-pulse" />
            ) : getCheckIn.isError ? (
              <p className="text-[13px] text-gray-500">Couldn&apos;t load check-ins.</p>
            ) : lastCheckIn ? (
              <div className="flex items-start gap-3">
                <span className="size-9 rounded-full bg-default/10 inline-flex items-center justify-center shrink-0">
                  <LocationTick size={18} color="var(--color-default)" variant="Bold" />
                </span>
                <div className="text-[13px] min-w-0">
                  <p className="font-semibold">{moment(lastCheckIn.createdAt).calendar()}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {lastCheckIn.checkInType === "admin"
                      ? `By ${lastCheckIn.checkedInBy?.firstname || ""} ${lastCheckIn.checkedInBy?.lastname || ""}${lastCheckIn.method === "qr" ? " (QR scan)" : ""}`
                      : lastCheckIn.location
                      ? `Self check-in, ${Math.round(lastCheckIn.location.distanceMeters)} m from the gym`
                      : "Self check-in"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-gray-500">{firstname} has never checked in.</p>
            )}
          </Panel>

          <Panel title="Account">
            <dl className="text-[13px] divide-y">
              {[
                { icon: Calendar, label: "Joined", value: moment(memberDetails.createdAt).format("D MMM YYYY") },
                {
                  icon: Clock,
                  label: "Last login",
                  value: memberDetails.lastLoginAt ? moment(memberDetails.lastLoginAt).format("D MMM YYYY, h:mm a") : "Never",
                },
                {
                  icon: Sms,
                  label: "Reminder emails",
                  value: memberDetails.notificationPreferences?.activityReminders === false ? "Turned off" : "On",
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <dt className="flex items-center gap-2 text-gray-500">
                    {React.createElement(row.icon, { size: 15, color: "currentColor" })}
                    {row.label}
                  </dt>
                  <dd className="font-semibold text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
};

const MemberActivitySection = ({ member }: { member: UserWithSub }) => {
  const activity = member?.activity;

  const reasonLabel: Record<string, string> = {
    "check-in": "after a check-in",
    login: "after logging in",
    scheduled: "due to inactivity",
  };

  const stats: { label: string; value: ReactNode; sub?: string | null }[] = [
    {
      label: "Last check-in",
      value: member?.lastCheckInAt ? moment(member.lastCheckInAt).format("ll") : "Never",
      sub: formatDays(activity?.daysSinceLastCheckIn),
    },
    {
      label: "Last login",
      value: member?.lastLoginAt ? moment(member.lastLoginAt).format("ll") : "None recorded",
      sub: formatDays(activity?.daysSinceLastLogin),
    },
    {
      label: "In zone since",
      value: activity?.zoneEnteredAt ? moment(activity.zoneEnteredAt).format("ll") : "N/A",
      sub: activity?.zoneEnteredAt ? moment(activity.zoneEnteredAt).fromNow() : null,
    },
    {
      label: "Previous zone",
      value: activity?.previousZone ? <ActivityZoneBadge zone={activity.previousZone} /> : "N/A",
    },
  ];

  return (
    <Panel title="Activity" action={<ActivityZoneBadge zone={activity?.zone} />}>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[12px] bg-gray-50 border border-gray-200/70 p-3">
            <p className="text-[11px] text-gray-500 mb-1">{stat.label}</p>
            <div className="text-[13px] font-semibold">{stat.value}</div>
            {stat.sub && <p className="text-[11px] text-gray-500 mt-0.5">{stat.sub}</p>}
          </div>
        ))}
      </div>

      {!!activity?.history?.length && (
        <div className="mt-5">
          <p className="text-[12px] font-semibold text-gray-700 mb-2">Zone changes</p>
          <ol className="relative border-l-2 border-gray-100 ml-1.5 space-y-3">
            {activity.history.map((h) => (
              <li key={h._id} className="relative pl-4 text-[12px]">
                <span className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-white border-2 border-default" />
                <div className="flex flex-wrap items-center gap-1.5">
                  {h.from ? <ActivityZoneBadge zone={h.from} /> : <span className="text-gray-400">New</span>}
                  <span className="text-gray-400">→</span>
                  <ActivityZoneBadge zone={h.to} />
                </div>
                <p className="text-gray-500 mt-1">
                  {moment(h.createdAt).format("ll")} · {reasonLabel[h.reason] || ""}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!!activity?.inactivityFeedback?.length && (
        <div className="mt-5">
          <p className="text-[12px] font-semibold text-gray-700 mb-2">Reasons given for inactivity</p>
          <ul className="grid gap-2">
            {activity.inactivityFeedback.map((f) => (
              <li key={f._id} className="rounded-[12px] border border-gray-200/80 p-3 text-[12px]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[13px]">{f.reasonLabel}</span>
                  <span className="text-gray-500">{moment(f.updatedAt).format("ll")}</span>
                </div>
                {f.note && (
                  <p className="mt-1.5 text-gray-700 whitespace-pre-line break-words">&ldquo;{f.note}&rdquo;</p>
                )}
                <p className="mt-1.5 text-gray-500 flex flex-wrap items-center gap-1">
                  From the reminder {f.reminderKind === "after" ? "after entering" : "before"}{" "}
                  <ActivityZoneBadge zone={f.reminderZone} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {member?.notificationPreferences?.activityReminders === false && (
        <p className="text-[12px] text-gray-500 mt-4">This member has turned off activity reminder emails.</p>
      )}
    </Panel>
  );
};

export default Member;
