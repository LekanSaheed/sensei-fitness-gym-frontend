"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import Spinner from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  QrCheckInPreview,
  useConfirmQrCheckInMutation,
  usePreviewQrCheckInMutation,
} from "@/redux/api-slices/admin.slice";
import { ErrorResponse } from "@/types";
import { ActivityZone } from "@/types/ActivityZone";
import { getInitials, isFetchBaseQueryError } from "@/utils";
import { CloseCircle, ScanBarcode, TickCircle, Warning2 } from "iconsax-react";
import jsQR from "jsqr";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Step = "scanning" | "checking" | "preview" | "done";

const CODE_PREFIX = "SENSEI-CHECKIN:";

const errorMessage = (res: unknown) => {
  const r = res as { error?: unknown; data?: { error?: string } };

  if (r?.error && isFetchBaseQueryError(r.error as never)) {
    return (
      ((r.error as { data?: ErrorResponse }).data as ErrorResponse)?.error ||
      DEFAULT_ERROR_MESSAGE
    );
  }

  return r?.data?.error || DEFAULT_ERROR_MESSAGE;
};

/** Turns a failed lookup into a title + explanation the admin can act on */
const describeFailure = (res: unknown): { title: string; message: string } => {
  const error = (res as { error?: { status?: number | string } })?.error;

  const status = error?.status;

  const serverMessage = errorMessage(res);

  if (status === 401 || status === 403) {
    return /role 'user'/i.test(serverMessage)
      ? {
          title: "Signed in as a member",
          message:
            "This browser is signed in with a member account, so the scan was refused. Sign out and sign in as an admin to scan codes. (Members and admins can't use the same browser at the same time.)",
        }
      : status === 401
      ? {
          title: "Session expired",
          message: "Your admin session has expired. Sign in again and retry.",
        }
      : {
          title: "Not allowed",
          message:
            "Your admin account doesn't have the \"check member in\" permission.",
        };
  }

  if (status === 404) {
    return {
      title: "Member not found",
      message:
        "This code belongs to an account that no longer exists or isn't a member account.",
    };
  }

  if (status === 429) {
    return {
      title: "Too many requests",
      message: "Too many requests from this network. Wait a minute and retry.",
    };
  }

  if (status === "FETCH_ERROR" || status === "TIMEOUT_ERROR") {
    return {
      title: "Couldn't reach the server",
      message: "Check the internet connection and try again.",
    };
  }

  if (/different copy of the app/i.test(serverMessage)) {
    return { title: "Pass from a different site", message: serverMessage };
  }

  return { title: "Code not recognised", message: serverMessage };
};

/**
 * Admin QR check-in: scan the member's permanent code, review who it is and
 * whether they're allowed in, then confirm. All rules are enforced on the
 * server again when confirming.
 */
const QrCheckInScanner = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const frameRef = useRef<number | null>(null);

  const [step, setStep] = useState<Step>("scanning");

  const [cameraError, setCameraError] = useState<string | null>(null);

  const [manualCode, setManualCode] = useState("");

  const [code, setCode] = useState("");

  const [preview, setPreview] = useState<QrCheckInPreview | null>(null);

  const [scanError, setScanError] = useState<string | null>(null);

  const [failure, setFailure] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const [previewCheckIn] = usePreviewQrCheckInMutation();

  const [confirmCheckIn, confirmStatus] = useConfirmQrCheckInMutation();

  const stopCamera = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());

    streamRef.current = null;
  }, []);

  const lookUp = useCallback(
    async (scanned: string) => {
      stopCamera();

      setCode(scanned);

      setScanError(null);

      setFailure(null);

      setStep("checking");

      const res = await previewCheckIn({ code: scanned });

      if ("data" in res && res.data?.success && res.data.data) {
        setPreview(res.data.data);

        setStep("preview");
      } else {
        setFailure(describeFailure(res));

        setStep("preview");

        setPreview(null);
      }
    },
    [previewCheckIn, stopCamera]
  );

  const startCamera = useCallback(async () => {
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "This browser can't open the camera. Type or paste the member's code below instead."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) return;

      video.srcObject = stream;

      await video.play();

      // Prefer the browser's built-in detector (Chrome/Android): faster and
      // better with real cameras. jsQR is the fallback everywhere else.
      type Detector = { detect: (s: CanvasImageSource) => Promise<{ rawValue: string }[]> };

      let detector: Detector | null = null;

      const BD = (window as unknown as {
        BarcodeDetector?: {
          new (o: { formats: string[] }): Detector;
          getSupportedFormats?: () => Promise<string[]>;
        };
      }).BarcodeDetector;

      if (BD) {
        try {
          const formats = (await BD.getSupportedFormats?.()) || [];

          if (formats.includes("qr_code")) {
            detector = new BD({ formats: ["qr_code"] });
          }
        } catch {
          detector = null;
        }
      }

      let last = 0;

      let busy = false;

      const handle = (text: string | undefined | null) => {
        if (!text) return;

        const value = text.trim();

        if (value.startsWith(CODE_PREFIX)) {
          if (navigator.vibrate) navigator.vibrate(80);

          void lookUp(value);
        } else {
          setScanError(
            "That QR code isn't a SEN-SEI member code. Ask the member to open the code on their profile."
          );
        }
      };

      const tick = async (time: number) => {
        frameRef.current = requestAnimationFrame(tick);

        // ~6 decodes a second is plenty and keeps the CPU cool
        if (busy || time - last < 160) return;

        last = time;

        if (video.readyState < 2 || !video.videoWidth) return;

        busy = true;

        try {
          if (detector) {
            const codes = await detector.detect(video);

            handle(codes[0]?.rawValue);

            return;
          }

          const canvas = canvasRef.current;

          if (!canvas) return;

          // Decode a scaled-down frame: much faster on phones, still sharp enough
          const scale = Math.min(1, 800 / video.videoWidth);

          const w = Math.round(video.videoWidth * scale);

          const h = Math.round(video.videoHeight * scale);

          canvas.width = w;

          canvas.height = h;

          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          if (!ctx) return;

          ctx.drawImage(video, 0, 0, w, h);

          const found = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, {
            inversionAttempts: "attemptBoth",
          });

          handle(found?.data);
        } catch {
          // ignore a bad frame and keep scanning
        } finally {
          busy = false;
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const name = (err as DOMException)?.name;

      setCameraError(
        name === "NotAllowedError"
          ? "Camera access was blocked. Allow camera access in your browser settings, or type the code below."
          : name === "NotFoundError"
          ? "No camera was found on this device. Type or paste the member's code below."
          : "Couldn't start the camera. Type or paste the member's code below."
      );
    }
  }, [lookUp]);

  const reset = useCallback(() => {
    setPreview(null);

    setCode("");

    setManualCode("");

    setScanError(null);

    setFailure(null);

    setStep("scanning");
  }, []);

  // Start the camera whenever we're on the scanning step; always clean up
  useEffect(() => {
    if (open && step === "scanning") void startCamera();

    return () => stopCamera();
  }, [open, step, startCamera, stopCamera]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const confirm = async () => {
    const res = await confirmCheckIn({ code });

    if ("data" in res && res.data?.success) {
      toast.success(res.data.message || "Checked in");

      setStep("done");
    } else {
      toast.error(errorMessage(res));

      // Rules may have changed (e.g. checked in on another device): refresh
      void lookUp(code);
    }
  };

  const member = preview?.member;

  const sub = preview?.subscription;

  const footer =
    step === "preview" ? (
      <div className="grid grid-cols-2 gap-2">
        <Button
          label="Scan another"
          variant="outlined"
          color="black"
          fullRadius
          size="lg"
          fullWidth
          onClick={reset}
        />
        <Button
          label={member ? `Check in ${member.firstname}` : "Check in"}
          fullRadius
          size="lg"
          fullWidth
          disabled={!preview?.eligible || confirmStatus.isLoading}
          loading={confirmStatus.isLoading}
          onClick={confirm}
          permissions={["check_member_in"]}
        />
      </div>
    ) : step === "done" ? (
      <Button
        label="Scan next member"
        fullRadius
        size="lg"
        fullWidth
        onClick={reset}
      />
    ) : undefined;

  return (
    <DialogModal
      open={open}
      setOpen={setOpen}
      title="Scan member QR code"
      description="Point the camera at the code on the member's profile"
      icon={ScanBarcode}
      size="md"
      footer={footer}
    >
      {step === "scanning" && (
        <div>
          {!cameraError ? (
            <div className="relative overflow-hidden rounded-[18px] bg-black aspect-square sm:aspect-[4/3]">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                muted
              />
              {/* viewfinder */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative size-[62%] max-w-[260px] max-h-[260px]">
                  {[
                    "top-0 left-0 border-t-4 border-l-4 rounded-tl-[18px]",
                    "top-0 right-0 border-t-4 border-r-4 rounded-tr-[18px]",
                    "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-[18px]",
                    "bottom-0 right-0 border-b-4 border-r-4 rounded-br-[18px]",
                  ].map((c) => (
                    <span
                      key={c}
                      className={`absolute size-10 border-default ${c}`}
                    />
                  ))}
                  <span className="absolute left-2 right-2 h-[2px] bg-default/80 shadow-[0_0_12px_var(--color-default)] animate-[scanline_2.2s_ease-in-out_infinite]" />
                </div>
              </div>
              <p className="absolute bottom-3 inset-x-0 text-center text-[12px] text-white/80">
                Hold the code inside the frame
              </p>
            </div>
          ) : (
            <div className="rounded-[18px] bg-amber-50 border border-amber-200 p-4 text-[13px] text-amber-800 flex gap-2">
              <Warning2 size={18} color="currentColor" className="shrink-0" />
              {cameraError}
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {scanError && (
            <p className="mt-3 text-[12px] text-rose-600 text-center">
              {scanError}
            </p>
          )}

          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();

              const value = manualCode.trim();

              if (value) void lookUp(value);
            }}
          >
            <p className="text-[12px] text-gray-500 mb-1.5">
              Or type / paste the code (USB scanners work here too)
            </p>
            <div className="flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="SENSEI-CHECKIN:…"
                className="flex-1 min-w-0 h-11 rounded-[12px] border border-gray-200 px-3 text-[13px] outline-none focus:border-default focus:ring-4 focus:ring-default/15"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                type="submit"
                label="Look up"
                color="black"
                fullRadius
                disabled={!manualCode.trim()}
              />
            </div>
          </form>
        </div>
      )}

      {step === "checking" && (
        <div className="py-16 flex flex-col items-center gap-3 text-gray-500 text-[13px]">
          <span className="text-[32px] text-default">
            <Spinner />
          </span>
          Looking up member…
        </div>
      )}

      {step === "preview" && !preview && (
        <div className="py-10 flex flex-col items-center text-center gap-3">
          <span className="size-14 rounded-full bg-rose-50 flex items-center justify-center">
            <CloseCircle size={28} color="var(--color-rose-500)" variant="Bold" />
          </span>
          <p className="font-semibold">
            {failure?.title || "Code not recognised"}
          </p>
          <p className="text-[13px] text-gray-500 max-w-[360px]">
            {failure?.message}
          </p>
        </div>
      )}

      {step === "preview" && preview && member && (
        <div>
          <div className="flex items-center gap-4">
            <Avatar className="size-20 ring-4 ring-default/20">
              <AvatarImage src={member.profile_picture} />
              <AvatarFallback className="bg-default/15 text-default-secondary text-[22px] font-semibold">
                {getInitials(`${member.firstname} ${member.lastname}`)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-tight truncate">
                {member.firstname} {member.lastname}
              </p>
              <p className="text-[13px] text-gray-500 truncate">
                @{member.username} · {member.email}
              </p>
              {member.zone && (
                <div className="mt-1.5">
                  <ActivityZoneBadge zone={member.zone as ActivityZone} />
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-500 mt-3">
            Check the photo matches the person in front of you.
          </p>

          <div
            className={`mt-4 rounded-[14px] p-3.5 flex gap-2.5 text-[13px] ${
              preview.eligible
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {preview.eligible ? (
              <TickCircle size={20} color="currentColor" variant="Bold" />
            ) : (
              <Warning2 size={20} color="currentColor" variant="Bold" />
            )}
            <span className="font-semibold">
              {preview.eligible ? "Ready to check in" : preview.reason}
            </span>
          </div>

          <dl className="mt-4 rounded-[14px] border border-gray-100 divide-y divide-gray-100 text-[13px]">
            <div className="flex justify-between gap-3 px-3.5 py-2.5">
              <dt className="text-gray-500">Plan</dt>
              <dd className="font-semibold text-right">
                {sub ? (
                  <>
                    {sub.planName}
                    {sub.includesTrainer ? " · trainer" : ""}
                  </>
                ) : (
                  "No active plan"
                )}
              </dd>
            </div>
            {sub && (
              <div className="flex justify-between gap-3 px-3.5 py-2.5">
                <dt className="text-gray-500">Valid until</dt>
                <dd className="font-semibold">
                  {moment(sub.endDate).format("ll")}
                </dd>
              </div>
            )}
            {sub?.planType === "SESSION_BASED" && (
              <>
                <div className="flex justify-between gap-3 px-3.5 py-2.5">
                  <dt className="text-gray-500">This week</dt>
                  <dd className="font-semibold">
                    {sub.checkInsThisWeek ?? 0} / {sub.checkInsPerWeek ?? 0}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 px-3.5 py-2.5">
                  <dt className="text-gray-500">Used on plan</dt>
                  <dd className="font-semibold">
                    {sub.totalOnPlan ?? 0} / {sub.totalCheckIns ?? 0}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 px-3.5 py-2.5">
                  <dt className="text-gray-500">Session days</dt>
                  <dd className="font-semibold text-right">
                    {(sub.allowedDays || []).join(", ") || "Any"}
                  </dd>
                </div>
              </>
            )}
            <div className="flex justify-between gap-3 px-3.5 py-2.5">
              <dt className="text-gray-500">Last check-in</dt>
              <dd className="font-semibold">
                {preview.lastCheckInAt
                  ? moment(preview.lastCheckInAt).calendar()
                  : "Never"}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {step === "done" && member && (
        <div className="py-8 flex flex-col items-center text-center gap-3">
          <span className="size-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <TickCircle
              size={36}
              color="var(--color-emerald-500)"
              variant="Bold"
            />
          </span>
          <p className="text-[18px] font-bold">
            {member.firstname} is checked in
          </p>
          <p className="text-[13px] text-gray-500">
            {moment().format("dddd, D MMMM · h:mm a")}
          </p>
        </div>
      )}
    </DialogModal>
  );
};

export default QrCheckInScanner;
