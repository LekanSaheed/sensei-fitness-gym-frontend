"use client";

import { isWindow } from "@/utils";
import React from "react";
import { QRCode } from "react-qrcode-logo";
import logo from "../../../public/square_logo.jpg";

const ScanPage = () => {
  console.log(logo.src);
  const url = isWindow
    ? `${window.location.origin}/dashboard/check-in/new`
    : "";
  return (
    <div className="fixed inset-0 flex items-center justify-center text-center flex-col">
      <h2 className="text-[40px]  font-black">Check In</h2>
      <p className="mb-4">Scan the QRCode below to check-in for today</p>
      <QRCode
        value={url}
        logoImage={logo?.src}
        logoHeight={80}
        removeQrCodeBehindLogo
        logoWidth={80}
        logoPaddingStyle="square"
        size={250}
        qrStyle="dots"
      />
      <p className="max-w-[400px] text-[10px] mt-4">
        Unable to scan <span className="font-bold">QRCode?</span> Type in the
        url below into your browser or login to your app and click on the
        check-in now button
      </p>
      <div className="text-[14px] bg-default-secondary/10 text-default-secondary border border-default-secondary/10 mt-2 px-4 py-2 rounded-[10px]">
        {url}
      </div>
    </div>
  );
};

export default ScanPage;
