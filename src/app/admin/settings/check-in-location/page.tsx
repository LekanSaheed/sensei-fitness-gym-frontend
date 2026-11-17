"use client";

import Button from "@/components/button";
import Heading from "@/components/Heading";
import Input from "@/components/input";
import SectionLoader from "@/components/SectionLoader";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  useGetCheckInLocationSettingsQuery,
  useUpdateCheckInLocationSettingsMutation,
} from "@/redux/api-slices/admin.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import {
  formatMeters,
  getDeviceLocation,
  LocationError,
} from "@/utils/geolocation";
import { Export, InfoCircle, Location, Gps } from "iconsax-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Form = {
  enabled: boolean;
  latitude: string;
  longitude: string;
  radiusMeters: string;
  maxAccuracyMeters: string;
};

const toNumber = (v: string) => (v.trim() === "" ? null : Number(v));

/** Accepts "6.5244, 3.3792" pasted from Google Maps into either field */
const splitPair = (v: string) => {
  const m = v.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);

  return m ? { latitude: m[1], longitude: m[2] } : null;
};

const CheckInLocationSettingsPage = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCheckInLocationSettingsQuery(null);

  const settings = data?.data;

  const [update, updateStatus] = useUpdateCheckInLocationSettingsMutation();

  const [form, setForm] = useState<Form | null>(null);

  const [locating, setLocating] = useState(false);

  const [lastReading, setLastReading] = useState<number | null>(null);

  useEffect(() => {
    if (!settings) return;

    setForm({
      enabled: settings.enabled,
      latitude: settings.latitude?.toString() ?? "",
      longitude: settings.longitude?.toString() ?? "",
      radiusMeters: settings.radiusMeters.toString(),
      maxAccuracyMeters: settings.maxAccuracyMeters.toString(),
    });
  }, [settings]);

  if (!form || !settings) {
    return (
      <div className="max-w-[760px]">
        <SectionLoader
          loading={isLoading || isFetching}
          error={isError}
          refetch={refetch}
        />
      </div>
    );
  }

  const lat = toNumber(form.latitude);

  const lng = toNumber(form.longitude);

  const radius = Number(form.radiusMeters);

  const accuracy = Number(form.maxAccuracyMeters);

  const latError =
    lat !== null && (isNaN(lat) || lat < -90 || lat > 90)
      ? "Latitude must be between -90 and 90"
      : undefined;

  const lngError =
    lng !== null && (isNaN(lng) || lng < -180 || lng > 180)
      ? "Longitude must be between -180 and 180"
      : undefined;

  const pairError =
    (lat === null) !== (lng === null)
      ? "Enter both latitude and longitude"
      : undefined;

  const radiusError =
    !Number.isInteger(radius) || radius < 20 || radius > 5000
      ? "Use a whole number from 20 to 5000"
      : undefined;

  const accuracyError =
    !Number.isInteger(accuracy) || accuracy < 10 || accuracy > 5000
      ? "Use a whole number from 10 to 5000"
      : undefined;

  const hasLocation = lat !== null && lng !== null && !latError && !lngError;

  const enableError =
    form.enabled && !hasLocation
      ? "Set the gym's location before turning this on"
      : undefined;

  const invalid = !!(
    latError ||
    lngError ||
    pairError ||
    radiusError ||
    accuracyError ||
    enableError
  );

  const dirty =
    form.enabled !== settings.enabled ||
    lat !== settings.latitude ||
    lng !== settings.longitude ||
    radius !== settings.radiusMeters ||
    accuracy !== settings.maxAccuracyMeters;

  const set = (patch: Partial<Form>) => setForm({ ...form, ...patch });

  const useCurrentLocation = async () => {
    setLocating(true);

    try {
      const reading = await getDeviceLocation(20000);

      set({
        latitude: reading.latitude.toFixed(6),
        longitude: reading.longitude.toFixed(6),
      });

      setLastReading(reading.accuracy);

      if (reading.accuracy > 50) {
        toast(
          `Location set, but it's only accurate to about ${formatMeters(reading.accuracy)}. Check it on Google Maps.`,
          { icon: "⚠️" }
        );
      } else {
        toast.success("Location set from this device");
      }
    } catch (err) {
      toast.error(
        err instanceof LocationError ? err.message : DEFAULT_ERROR_MESSAGE
      );
    } finally {
      setLocating(false);
    }
  };

  const save = async () => {
    const res = await update({
      enabled: form.enabled,
      latitude: lat,
      longitude: lng,
      radiusMeters: radius,
      maxAccuracyMeters: accuracy,
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      toast.error(
        (res.error.data as ErrorResponse)?.error || DEFAULT_ERROR_MESSAGE
      );
    } else if (res.data?.success) {
      toast.success(res.data.message || "Saved");
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <div className="max-w-[760px]">
      <form
        className="bg-white rounded-[18px] border border-gray-200/80 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] px-5 md:px-7 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <section className="py-4 border-b">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span>
              <Heading className="!mb-0">Location check-in</Heading>
              <span className="block text-[12px] text-gray-500 mt-1">
                When on, members can only check themselves in when their phone
                shows they&apos;re at the gym. Front-desk and QR check-ins are
                not affected.
              </span>
            </span>
            <Switch
              checked={form.enabled}
              onCheckedChange={(checked) => set({ enabled: checked })}
              aria-label="Require members to be at the gym to self check-in"
            />
          </label>
          {enableError && (
            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[8px] px-3 py-2">
              <InfoCircle size={14} color="currentColor" />
              {enableError}
            </p>
          )}
        </section>

        <section className="py-4 border-b">
          <Heading>Gym location</Heading>
          <p className="text-[12px] text-gray-500 mb-3">
            Stand inside the gym and use your current location, or paste the
            coordinates from Google Maps (right-click the gym &rarr; copy the
            numbers).
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              label={locating ? "Getting location…" : "Use my current location"}
              icon={Gps}
              variant="outlined"
              color="black"
              size="sm"
              fullRadius
              loading={locating}
              onClick={useCurrentLocation}
            />
            {hasLocation && (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Export size={16} color="currentColor" />
                Check on Google Maps
              </a>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-4">
            <Input
              label="Latitude"
              placeholder="e.g. 6.524400"
              inputMode="decimal"
              value={form.latitude}
              error={latError || pairError}
              onChange={(e) => {
                const pair = splitPair(e.target.value);

                set(pair || { latitude: e.target.value });
              }}
            />
            <Input
              label="Longitude"
              placeholder="e.g. 3.379200"
              inputMode="decimal"
              value={form.longitude}
              error={lngError}
              onChange={(e) => {
                const pair = splitPair(e.target.value);

                set(pair || { longitude: e.target.value });
              }}
            />
          </div>
          {lastReading !== null && (
            <p className="text-[12px] text-gray-500 -mt-2 flex items-center gap-1.5">
              <Location size={14} color="currentColor" />
              Last reading from this device was accurate to about{" "}
              {formatMeters(lastReading)}.
            </p>
          )}
        </section>

        <section className="py-4 border-b">
          <Heading>How strict</Heading>
          <p className="text-[12px] text-gray-500 mb-3">
            Phones are usually accurate to 10–50 m indoors. Start generous and
            tighten it once members have used it for a while.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Input
              label="Allowed distance from the gym (metres)"
              type="number"
              min={20}
              max={5000}
              value={form.radiusMeters}
              error={radiusError}
              onChange={(e) => set({ radiusMeters: e.target.value })}
            />
            <Input
              label="Least precise reading accepted (metres)"
              type="number"
              min={10}
              max={5000}
              value={form.maxAccuracyMeters}
              error={accuracyError}
              onChange={(e) => set({ maxAccuracyMeters: e.target.value })}
            />
          </div>
          <p className="text-[12px] text-gray-500 -mt-2">
            A check-in is allowed when the member is within{" "}
            {radiusError ? "the allowed distance" : formatMeters(radius)} of the
            gym, give or take their phone&apos;s accuracy. Readings less precise
            than{" "}
            {accuracyError ? "the limit" : formatMeters(accuracy)} are refused
            and the member is asked to turn on GPS.
          </p>
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
            disabled={!dirty || invalid || updateStatus.isLoading}
            permissions={["manage_check_in_location"]}
          />
        </div>
      </form>
    </div>
  );
};

export default CheckInLocationSettingsPage;
