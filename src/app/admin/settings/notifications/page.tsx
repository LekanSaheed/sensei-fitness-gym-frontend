"use client";

import Button from "@/components/button";
import Heading from "@/components/Heading";
import SectionLoader from "@/components/SectionLoader";
import TextArea from "@/components/textarea";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/redux/api-slices/admin.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { InfoCircle } from "iconsax-react";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const MAX_RECIPIENTS = 25;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Same parsing as the server: commas, semicolons or new lines */
const parseRecipients = (value: string) => [
  ...new Set(
    value
      .split(/[,;\n]/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  ),
];

const NotificationSettingsPage = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetNotificationSettingsQuery(null);

  const settings = data?.data;

  const [update, updateStatus] = useUpdateNotificationSettingsMutation();

  const [recipientsText, setRecipientsText] = useState("");

  const [events, setEvents] = useState<Record<string, { enabled: boolean }>>(
    {}
  );

  // Load saved values into the form
  useEffect(() => {
    if (!settings) return;

    setRecipientsText((settings.recipients || []).join(", "));

    setEvents(settings.events || {});
  }, [settings]);

  const recipients = useMemo(
    () => parseRecipients(recipientsText),
    [recipientsText]
  );

  const invalid = recipients.filter((e) => !EMAIL_PATTERN.test(e));

  const tooMany = recipients.length > MAX_RECIPIENTS;

  const dirty =
    !!settings &&
    (recipients.join(",") !== (settings.recipients || []).join(",") ||
      (settings.availableEvents || []).some(
        (e) =>
          !!events[e.key]?.enabled !== !!settings.events?.[e.key]?.enabled
      ));

  const enabledCount = (settings?.availableEvents || []).filter(
    (e) => events[e.key]?.enabled
  ).length;

  const save = async () => {
    const res = await update({
      recipients: recipients.join(", "),
      events: Object.fromEntries(
        (settings?.availableEvents || []).map((e) => [
          e.key,
          { enabled: !!events[e.key]?.enabled },
        ])
      ),
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else if (res.data?.success) {
      toast.success(res.data?.message || "Notification settings updated");
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  const loading = isLoading || isFetching;

  return (
    <div className="max-w-[760px]">
      <SectionLoader
        loading={loading && !settings}
        error={isError}
        refetch={refetch}
      />

      {settings && !isError && (
        <form
          className="bg-white rounded-[18px] border border-gray-200/80 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] px-5 md:px-7 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <section className="py-4 border-b">
            <Heading>Who gets notified</Heading>
            <p className="text-[12px] text-gray-500 mb-3">
              Enter the email addresses that should receive admin
              notifications, separated by commas. Each address gets its own
              email.
            </p>

            <TextArea
              label="Email addresses"
              placeholder="owner@example.com, manager@example.com"
              rows={3}
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              error={
                invalid.length
                  ? `Check ${invalid.length === 1 ? "this address" : "these addresses"}: ${invalid.join(", ")}`
                  : tooMany
                  ? `You can add up to ${MAX_RECIPIENTS} email addresses`
                  : undefined
              }
              topRight={
                <span className="text-[11px] text-gray-500">
                  {recipients.length}/{MAX_RECIPIENTS}
                </span>
              }
            />

            {recipients.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5 -mt-2">
                {recipients.map((email) => {
                  const ok = EMAIL_PATTERN.test(email);

                  return (
                    <li
                      key={email}
                      className={`rounded-full px-2.5 py-1 text-[12px] border ${
                        ok
                          ? "bg-default/10 border-default/30 text-default-secondary"
                          : "bg-rose-50 border-rose-200 text-rose-600"
                      }`}
                    >
                      {email}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="flex items-center gap-1.5 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[8px] px-3 py-2 -mt-2">
                <InfoCircle size={14} color="currentColor" />
                No one will receive notifications until you add at least one
                email address.
              </p>
            )}
          </section>

          <section className="py-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <Heading className="!mb-0">Notify me when</Heading>
              <span className="text-[12px] text-gray-500">
                {enabledCount}/{settings.availableEvents?.length || 0} on
              </span>
            </div>
            <p className="text-[12px] text-gray-500 mb-3">
              Choose which actions send an email to the addresses above.
            </p>

            <ul className="border rounded-[10px] divide-y">
              {(settings.availableEvents || []).map((event) => (
                <li key={event.key}>
                  <label className="flex items-center justify-between gap-4 p-4 cursor-pointer">
                    <span>
                      <span className="block text-[14px] font-semibold">
                        {event.label}
                      </span>
                      <span className="block text-[12px] text-gray-500">
                        {event.description}
                      </span>
                    </span>
                    <Switch
                      checked={!!events[event.key]?.enabled}
                      onCheckedChange={(checked) =>
                        setEvents((prev) => ({
                          ...prev,
                          [event.key]: { enabled: checked },
                        }))
                      }
                      aria-label={event.label}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex items-center justify-between gap-4 py-4">
            <p className="text-[11px] text-gray-500">
              {settings.updatedAt
                ? `Last updated ${moment(settings.updatedAt).calendar()}`
                : ""}
            </p>
            <Button
              type="submit"
              label="Save Settings"
              loading={updateStatus.isLoading}
              disabled={
                !dirty ||
                invalid.length > 0 ||
                tooMany ||
                updateStatus.isLoading
              }
              permissions={["manage_notification_settings"]}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default NotificationSettingsPage;
