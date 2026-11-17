"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import Button from "@/components/button";
import Heading from "@/components/Heading";
import Input from "@/components/input";
import SectionLoader from "@/components/SectionLoader";
import TextArea from "@/components/textarea";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  useGetActivityZoneSettingsQuery,
  useUpdateActivityZoneSettingsMutation,
} from "@/redux/api-slices/admin.slice";
import { ErrorResponse } from "@/types";
import {
  ActivityZoneSettings,
  NOTIFIABLE_ZONES,
  NotifiableZone,
} from "@/types/ActivityZone";
import { isFetchBaseQueryError } from "@/utils";
import { FormikErrors, useFormik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

type ReminderTab = "before" | "after";

/** Form section for each tab */
const SECTION: Record<ReminderTab, "notifications" | "afterEntering"> = {
  before: "notifications",
  after: "afterEntering",
};

const thresholdField: Record<
  NotifiableZone,
  keyof ActivityZoneSettings["thresholds"]
> = {
  not_active: "notActiveDays",
  warning: "warningDays",
  danger: "dangerDays",
};

const thresholdHelp: Record<NotifiableZone, string> = {
  not_active: "Days without a check-in before a member is Not Active",
  warning:
    "Days without logging in or checking in before a member is in Warning",
  danger: "Days without a check-in before a member is in Danger",
};

const days = (label: string) =>
  yup
    .number()
    .typeError(`${label} must be a number`)
    .integer(`${label} must be a whole number`)
    .required(`${label} is required`);

const messageFields = {
  enabled: yup.boolean().required(),
  title: yup.string().trim().max(150).required("Title is required"),
  message: yup.string().trim().max(1000).required("Message is required"),
  repeatIntervalDays: days("Repeat interval").min(0, "Cannot be negative"),
};

const beforeSchema = yup.object({
  ...messageFields,
  daysBefore: days("Days before").min(1, "Must be at least 1 day"),
});

const afterSchema = yup.object({
  ...messageFields,
  daysAfter: days("Days after").min(0, "Cannot be negative").max(365),
});

const schema = yup.object({
  thresholds: yup.object({
    notActiveDays: days("Not Active threshold").min(1),
    warningDays: days("Warning threshold").moreThan(
      yup.ref("notActiveDays"),
      "Must be greater than the Not Active threshold"
    ),
    dangerDays: days("Danger threshold").moreThan(
      yup.ref("warningDays"),
      "Must be greater than the Warning threshold"
    ),
  }),
  notifications: yup.object({
    not_active: beforeSchema,
    warning: beforeSchema,
    danger: beforeSchema,
  }),
  afterEntering: yup.object({
    not_active: afterSchema,
    warning: afterSchema,
    danger: afterSchema,
  }),
});

const tabCopy: Record<
  ReminderTab,
  { label: string; intro: string; daysPlaceholder: string }
> = {
  before: {
    label: "Before entering",
    intro:
      "Sent shortly before a member enters a zone, to encourage them to check in in time.",
    daysPlaceholder: "time left before they enter the zone",
  },
  after: {
    label: "After entering",
    intro:
      "Sent once a member is in a zone, to let them know where they stand and invite them back.",
    daysPlaceholder:
      "time since their last check-in (last visit for Warning)",
  },
};

const ActivityZoneSettingsPage = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetActivityZoneSettingsQuery(null);

  const settings = data?.data;

  const [update, updateStatus] = useUpdateActivityZoneSettingsMutation();

  const [tab, setTab] = useState<ReminderTab>("before");

  const formik = useFormik<ActivityZoneSettings>({
    enableReinitialize: true,
    initialValues: {
      thresholds: settings?.thresholds || {
        notActiveDays: 14,
        warningDays: 60,
        dangerDays: 90,
      },
      notifications: settings?.notifications || ({} as never),
      afterEntering: settings?.afterEntering || ({} as never),
    },
    validationSchema: schema,
    validate: (values) => {
      // daysBefore must be smaller than the zone's threshold
      const errors: FormikErrors<ActivityZoneSettings> = {};

      NOTIFIABLE_ZONES.forEach((zone) => {
        const threshold = Number(values.thresholds[thresholdField[zone]]);

        if (Number(values.notifications?.[zone]?.daysBefore) >= threshold) {
          errors.notifications = {
            ...(errors.notifications as object),
            [zone]: {
              daysBefore: `Must be less than the zone threshold (${threshold} days)`,
            },
          };
        }
      });

      return errors;
    },
    onSubmit: async (values) => {
      const toNumber = (v: unknown) => Number(v);

      const messageOf = (n: {
        enabled: boolean;
        title: string;
        message: string;
        repeatIntervalDays: number;
      }) => ({
        enabled: !!n.enabled,
        title: n.title.trim(),
        message: n.message.trim(),
        repeatIntervalDays: toNumber(n.repeatIntervalDays),
      });

      const payload: ActivityZoneSettings = {
        thresholds: {
          notActiveDays: toNumber(values.thresholds.notActiveDays),
          warningDays: toNumber(values.thresholds.warningDays),
          dangerDays: toNumber(values.thresholds.dangerDays),
        },
        notifications: Object.fromEntries(
          NOTIFIABLE_ZONES.map((zone) => {
            const n = values.notifications[zone];

            return [
              zone,
              { ...messageOf(n), daysBefore: toNumber(n.daysBefore) },
            ];
          })
        ) as ActivityZoneSettings["notifications"],
        afterEntering: Object.fromEntries(
          NOTIFIABLE_ZONES.map((zone) => {
            const n = values.afterEntering[zone];

            return [
              zone,
              { ...messageOf(n), daysAfter: toNumber(n.daysAfter) },
            ];
          })
        ) as ActivityZoneSettings["afterEntering"],
      };

      const res = await update(payload);

      if ("error" in res && isFetchBaseQueryError(res.error)) {
        const errorData = res.error?.data as ErrorResponse;

        toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
      } else if (res.data?.success) {
        toast.success(res.data?.message || "Settings updated");
      } else {
        toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
      }
    },
  });

  const loading = isLoading || isFetching;

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    formik;

  const thresholdError = (key: keyof ActivityZoneSettings["thresholds"]) =>
    touched.thresholds?.[key] ? errors.thresholds?.[key] : undefined;

  const fieldError = (
    section: "notifications" | "afterEntering",
    zone: NotifiableZone,
    key: string
  ) => {
    const zoneErrors = errors[section]?.[zone] as
      | Record<string, string>
      | undefined;

    const zoneTouched = touched[section]?.[zone] as
      | Record<string, boolean>
      | undefined;

    return zoneTouched?.[key] || formik.submitCount > 0
      ? zoneErrors?.[key]
      : undefined;
  };

  const tabHasErrors = (t: ReminderTab) =>
    formik.submitCount > 0 && !!errors[SECTION[t]];

  const enabledCount = (t: ReminderTab) =>
    NOTIFIABLE_ZONES.filter((z) => values[SECTION[t]]?.[z]?.enabled).length;

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await formik.validateForm();

    // Show the tab that has the problem so it isn't hidden
    if (!result.thresholds) {
      if (result[SECTION[tab]]) {
        // stay on current tab
      } else if (result.notifications) setTab("before");
      else if (result.afterEntering) setTab("after");
    }

    formik.handleSubmit();
  };

  const section = SECTION[tab];

  return (
    <div>
      <SectionLoader
        loading={loading && !settings}
        error={isError}
        refetch={refetch}
      />

      {settings && !isError && (
        <form
          onSubmit={onSave}
          className="max-w-[900px] bg-white rounded-[18px] border border-gray-200/80 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] px-5 md:px-7 py-2"
        >
          <section className="py-4 border-b">
            <Heading>Activity Thresholds</Heading>
            <p className="text-[12px] text-gray-500 mb-4">
              Members are placed in the most severe zone they qualify for
              (Danger, then Warning, then Not Active). Members who have never
              checked in or logged in are measured from the date they signed
              up.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {NOTIFIABLE_ZONES.map((zone) => {
                const field = thresholdField[zone];

                return (
                  <div key={zone}>
                    <div className="mb-1">
                      <ActivityZoneBadge zone={zone} />
                    </div>
                    <Input
                      type="number"
                      min={1}
                      name={`thresholds.${field}`}
                      label="Days"
                      value={values.thresholds[field] ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={thresholdError(field)}
                    />
                    <p className="text-[11px] text-gray-500 -mt-2">
                      {thresholdHelp[zone]}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="py-4">
            <Heading>Reminder Notifications</Heading>
            <p className="text-[12px] text-gray-500 mb-4">
              Reminders are emailed to members who haven&apos;t turned off
              activity reminders. Each email links to a short form asking why
              they&apos;ve been away.
            </p>

            <div
              role="tablist"
              aria-label="Reminder timing"
              className="inline-flex w-full sm:w-auto rounded-full bg-gray-100 p-1 mb-4"
            >
              {(["before", "after"] as ReminderTab[]).map((t) => {
                const active = tab === t;

                return (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t)}
                    className={`relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                      active
                        ? "bg-white shadow-sm text-black"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tabCopy[t].label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        active
                          ? "bg-default/15 text-default-secondary"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {enabledCount(t)}/3 on
                    </span>
                    {tabHasErrors(t) && (
                      <span
                        className="absolute top-1 right-2 size-2 rounded-full bg-rose-500"
                        aria-label="Has errors"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-[12px] text-gray-500 mb-4">
              {tabCopy[tab].intro} You can use{" "}
              <code className="bg-gray-100 px-1 rounded">{"{firstname}"}</code>{" "}
              and <code className="bg-gray-100 px-1 rounded">{"{days}"}</code>{" "}
              ({tabCopy[tab].daysPlaceholder}, e.g. &quot;3 days&quot;) in the
              title and message.
            </p>

            <div role="tabpanel" className="grid gap-4">
              {NOTIFIABLE_ZONES.map((zone) => {
                const n = values[section]?.[zone] as
                  | (ActivityZoneSettings["notifications"][NotifiableZone] &
                      ActivityZoneSettings["afterEntering"][NotifiableZone])
                  | undefined;

                const base = `${section}.${zone}`;

                const timingKey = tab === "before" ? "daysBefore" : "daysAfter";

                return (
                  <div key={`${tab}-${zone}`} className="border rounded-[10px] p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 text-[13px] font-semibold">
                        {tabCopy[tab].label} <ActivityZoneBadge zone={zone} />
                      </div>
                      <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                        {n?.enabled ? "Enabled" : "Disabled"}
                        <Switch
                          checked={!!n?.enabled}
                          onCheckedChange={(checked) =>
                            setFieldValue(`${base}.enabled`, checked)
                          }
                        />
                      </label>
                    </div>

                    <div
                      className={`transition ${
                        n?.enabled ? "" : "opacity-50"
                      }`}
                    >
                      <div className="grid sm:grid-cols-2 gap-x-4">
                        <Input
                          type="number"
                          min={tab === "before" ? 1 : 0}
                          name={`${base}.${timingKey}`}
                          label={
                            tab === "before"
                              ? "Days before entering zone"
                              : "Days after entering (0 = same day)"
                          }
                          value={n?.[timingKey] ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={fieldError(section, zone, timingKey)}
                        />
                        <Input
                          type="number"
                          min={0}
                          name={`${base}.repeatIntervalDays`}
                          label={
                            tab === "before"
                              ? "Repeat every (days, 0 = send once)"
                              : "Repeat every (days, 0 = send once) while still in zone"
                          }
                          value={n?.repeatIntervalDays ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={fieldError(section, zone, "repeatIntervalDays")}
                        />
                      </div>
                      <Input
                        name={`${base}.title`}
                        label="Title / email subject"
                        value={n?.title ?? ""}
                        maxLength={150}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={fieldError(section, zone, "title")}
                      />
                      <TextArea
                        name={`${base}.message`}
                        label="Message"
                        rows={4}
                        maxLength={1000}
                        value={n?.message ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={fieldError(section, zone, "message")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex items-center justify-between gap-4 py-4">
            <p className="text-[11px] text-gray-500">
              {settings?.updatedAt
                ? `Last updated ${moment(settings.updatedAt).calendar()}`
                : ""}
            </p>
            <Button
              type="submit"
              label="Save Settings"
              loading={updateStatus.isLoading}
              disabled={!formik.dirty || updateStatus.isLoading}
              permissions={["manage_activity_zones"]}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default ActivityZoneSettingsPage;
