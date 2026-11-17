"use client";

import useUser from "@/hooks/useUser";
import { useGetMyCheckInCodeQuery } from "@/redux/api-slices/user.slice";
import { AnimatePresence, motion } from "framer-motion";
import { CloseCircle, Maximize4, ScanBarcode } from "iconsax-react";
import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";
import logo from "../../../public/square_logo.jpg";

/**
 * The member's permanent check-in QR code. Staff scan it at the front desk
 * from the admin Check-ins page.
 */
const CheckInPassCard = () => {
  const user = useUser();

  const { data, isLoading, isError, refetch } = useGetMyCheckInCodeQuery(null);

  const code = data?.data?.code;

  const [fullScreen, setFullScreen] = useState(false);

  /**
   * Small codes stay plain (medium error correction = fewer, bigger squares);
   * the large full-screen code can afford the logo with high error correction.
   * Both encode exactly the same text.
   */
  const qr = (size: number, withLogo: boolean) => (
    <QRCode
      value={code || ""}
      size={size}
      quietZone={10}
      ecLevel={withLogo ? "H" : "M"}
      {...(withLogo && {
        logoImage: logo.src,
        logoWidth: size * 0.18,
        logoHeight: size * 0.18,
        removeQrCodeBehindLogo: true,
        logoPaddingStyle: "square" as const,
      })}
      qrStyle="squares"
      eyeRadius={withLogo ? 6 : 0}
      fgColor="#121212"
      bgColor="#ffffff"
    />
  );

  return (
    <>
      <div className="rounded-[20px] bg-white border border-gray-200/70 p-4 flex items-center gap-4 dark:bg-card dark:border-border">
        <button
          onClick={() => code && setFullScreen(true)}
          aria-label="Show check-in code full screen"
          className="relative shrink-0 rounded-[14px] bg-white p-1.5 border border-gray-200 dark:border-transparent"
        >
          {isLoading ? (
            <div className="size-[140px] rounded-[10px] bg-gray-200 animate-pulse" />
          ) : isError || !code ? (
            <div className="size-[140px] rounded-[10px] bg-gray-100 flex items-center justify-center">
              <ScanBarcode size={32} color="var(--color-gray-400)" />
            </div>
          ) : (
            qr(140, false)
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[15px]">Your check-in pass</p>
          <p className="text-[12px] text-gray-500 dark:text-muted-foreground mt-0.5">
            Show this code at the front desk and staff will scan you in. It
            never changes, so you can save a screenshot.
          </p>
          {isError ? (
            <button
              onClick={() => refetch()}
              className="mt-2 text-[12px] font-semibold text-default"
            >
              Couldn&apos;t load your code. Retry
            </button>
          ) : (
            <button
              onClick={() => code && setFullScreen(true)}
              disabled={!code}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-default/10 px-3 py-1.5 text-[12px] font-semibold text-default disabled:opacity-50"
            >
              <Maximize4 size={14} color="currentColor" />
              Show full screen
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {fullScreen && code && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] bg-white flex flex-col items-center justify-center p-6 text-center text-black"
            onClick={() => setFullScreen(false)}
            role="dialog"
            aria-label="Check-in code"
          >
            <button
              aria-label="Close"
              className="absolute top-5 right-5 size-10 rounded-full bg-gray-100 flex items-center justify-center"
              onClick={() => setFullScreen(false)}
            >
              <CloseCircle size={22} color="#121212" />
            </button>
            <p className="font-league uppercase text-[34px] leading-none">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-[13px] text-gray-500 mt-1 mb-6">
              @{user?.username} · Show this to staff to check in
            </p>
            <div onClick={(e) => e.stopPropagation()}>{qr(300, true)}</div>
            <p className="text-[12px] text-gray-400 mt-6">
              Turn your screen brightness up if it doesn&apos;t scan
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CheckInPassCard;
