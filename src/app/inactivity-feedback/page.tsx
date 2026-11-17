"use client";

import Button from "@/components/button";
import Select, { SelectDropdownOption } from "@/components/select";
import Spinner from "@/components/Spinner";
import TextArea from "@/components/textarea";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { LOGIN } from "@/constants/routes";
import {
  useGetInactivityFeedbackSessionQuery,
  useSubmitInactivityFeedbackMutation,
} from "@/redux/api-slices/feedback.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { TickCircle } from "iconsax-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const NOTE_MAX = 500;

const InactivityFeedbackForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const { data, isLoading, isError, error } =
    useGetInactivityFeedbackSessionQuery(token, { skip: !token });

  const session = data?.data;

  const [reason, setReason] = useState<SelectDropdownOption | undefined>();

  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<{ reason?: string; note?: string }>({});

  const [submitted, setSubmitted] = useState(false);

  const [submit, submitStatus] = useSubmitInactivityFeedbackMutation();

  const options: SelectDropdownOption[] = (session?.reasons || []).map((r) => ({
    label: r.label,
    value: r.value,
  }));

  // Pre-fill if they already answered this reminder
  useEffect(() => {
    if (!session?.existing) return;

    const match = session.reasons.find(
      (r) => r.value === session.existing?.reason
    );

    if (match) setReason({ label: match.label, value: match.value });

    setNote(session.existing.note || "");
  }, [session]);

  const isOther = reason?.value === "other";

  const onSubmit = async () => {
    const nextErrors: typeof errors = {};

    if (!reason) nextErrors.reason = "Please select a reason";

    if (isOther && !note.trim())
      nextErrors.note = "Please tell us a little more about your reason";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    const res = await submit({
      token,
      reason: String(reason!.value),
      note: note.trim(),
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else if (res.data?.success) {
      setSubmitted(true);
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  if (!token || isError) {
    const message =
      (error &&
        isFetchBaseQueryError(error) &&
        (error.data as ErrorResponse)?.error) ||
      "This link is invalid or has expired";

    return (
      <div className="text-[14px]">
        <p className="mb-4">{message}.</p>
        <p className="text-white/85 mb-5">
          You can still log in to check in or update your membership.
        </p>
        <Link href={LOGIN}>
          <Button brandedFont label="Go to login" fullWidth />
        </Link>
      </div>
    );
  }

  if (isLoading || !session) {
    return (
      <div className="py-10 flex justify-center text-[30px]">
        <Spinner className="text-default" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <TickCircle
          size={48}
          color="var(--color-default)"
          variant="Bulk"
          className="mx-auto mb-3"
        />
        <p className="font-league uppercase text-[24px] mb-2">
          Thanks, {session.firstname}!
        </p>
        <p className="text-[14px] text-white/85 mb-6">
          Your feedback helps us make SEN-SEI Fitness better. We&apos;d love to
          see you back at the gym soon.
        </p>
        <Link href={LOGIN}>
          <Button brandedFont label="Log in to check in" fullWidth />
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <p className="text-[14px] mb-5">
        Hi {session.firstname}, we noticed you haven&apos;t been around in a
        while. What&apos;s been keeping you away?
      </p>

      {session.existing && (
        <p className="text-[12px] text-default-tertiary mb-4">
          You&apos;ve already answered. You can update your answer below.
        </p>
      )}

      <Select
        label="Reason"
        placeholder="Select a reason"
        options={options}
        selected={reason}
        onSelect={(option) => {
          setReason(option);
          setErrors((e) => ({ ...e, reason: undefined, note: undefined }));
        }}
        error={errors.reason}
      />

      <TextArea
        label={isOther ? "Tell us more" : "Anything else? (optional)"}
        placeholder={
          isOther
            ? "Tell us what's been keeping you away"
            : "Add a note if you'd like"
        }
        rows={4}
        maxLength={NOTE_MAX}
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setErrors((er) => ({ ...er, note: undefined }));
        }}
        error={errors.note}
        topRight={
          <span className="text-[11px] text-white/70">
            {note.length}/{NOTE_MAX}
          </span>
        }
      />

      <Button
        brandedFont
        type="submit"
        label={session.existing ? "Update my answer" : "Send feedback"}
        fullWidth
        loading={submitStatus.isLoading}
      />
    </form>
  );
};

const InactivityFeedbackPage = () => (
  <Suspense
    fallback={
      <div className="py-10 flex justify-center text-[30px]">
        <Spinner className="text-default" />
      </div>
    }
  >
    <InactivityFeedbackForm />
  </Suspense>
);

export default InactivityFeedbackPage;
