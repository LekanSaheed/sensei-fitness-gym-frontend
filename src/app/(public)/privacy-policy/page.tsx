import HeadingText from "@/components/landing-page/heading-text";
import React from "react";

export const privacyPolicy = [
  {
    heading: "Information We Collect",
    content: (
      <>
        We may collect personal information including, but not limited to, your
        name, phone number, email address, payment details, and any other
        information provided during registration, membership purchase, or use of
        our services.
      </>
    ),
  },
  {
    heading: "How We Use Your Information",
    content: (
      <>
        Personal information collected is used to manage memberships, process
        payments, provide gym services, communicate important updates, improve
        our offerings, and comply with legal or regulatory obligations.
      </>
    ),
  },
  {
    heading: "Information Sharing and Disclosure",
    content: (
      <>
        We do not sell, rent, or trade your personal information to third
        parties. Information may be shared only with service providers or
        partners where necessary to operate our services or where required by
        law.
      </>
    ),
  },
  {
    heading: "Data Security",
    content: (
      <>
        We take reasonable administrative, technical, and physical measures to
        protect personal information against unauthorized access, loss, misuse,
        or disclosure. However, no method of data transmission or storage is
        completely secure.
      </>
    ),
  },
  {
    heading: "Data Retention",
    content: (
      <>
        Personal information is retained only for as long as necessary to
        fulfill the purposes outlined in this Privacy Policy or as required by
        applicable laws and regulations.
      </>
    ),
  },
  {
    heading: "Your Rights",
    content: (
      <>
        You may request access to, correction of, or deletion of your personal
        information, subject to applicable legal obligations. Requests may be
        denied where retention is required by law.
      </>
    ),
  },
  {
    heading: "Cookies and Tracking Technologies",
    content: (
      <>
        Our website may use cookies or similar technologies to improve user
        experience, analyze usage, and support website functionality. You may
        adjust your browser settings to refuse cookies where supported.
      </>
    ),
  },
  {
    heading: "Policy Updates",
    content: (
      <>
        We reserve the right to update or modify this Privacy Policy at any
        time. Changes become effective immediately upon posting. Continued use
        of our services constitutes acceptance of the updated policy.
      </>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <HeadingText className="text-default">Privacy Policy</HeadingText>
      {/* <p className="mb-4 text-[14px]">
        {" "}
        These privacy govern the use of all gym facilities,
        services, memberships, training programs, and related offerings. By
        registering, making payment, or using any part of the gym, you
        acknowledge that you have read, understood, and agreed to be bound by
        these Terms and Conditions.
      </p> */}
      <ol>
        {privacyPolicy.map((t, id) => {
          return (
            <li key={id} className="mb-4">
              <h1 className="font-bold tracking-tight mb-1 ">{t.heading}</h1>
              <p className="text-[14px] opacity-90">{t.content}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default PrivacyPolicy;
