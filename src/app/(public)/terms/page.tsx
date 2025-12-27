import HeadingText from "@/components/landing-page/heading-text";
import React from "react";

export const termsAndConditions = [
  {
    heading: "Membership Eligibility and Use",
    content: (
      <>
        Memberships are granted solely to the registered individual and are
        strictly non-transferable unless expressly approved in writing by
        management. Access to facilities is subject to compliance with all gym
        rules, policies, and operating hours.
      </>
    ),
  },
  {
    heading: "Fees, Payments, and Refund Policy",
    content: (
      <>
        All fees for memberships, training sessions, boxing classes, or any
        other services must be paid in full prior to access or participation.{" "}
        <strong>
          All payments made to the gym are final, non-refundable, and
          non-returnable
        </strong>
        , regardless of usage, non-attendance, early termination, injury,
        illness, relocation, or change in personal circumstances.
      </>
    ),
  },
  {
    heading: "Health Declaration and Assumption of Risk",
    content: (
      <>
        Members confirm that they are physically and medically fit to
        participate in physical exercise. Use of the gym facilities and
        participation in any activity is undertaken entirely at the member’s own
        risk. The gym shall not be held liable for injuries or health
        complications except where required by law.
      </>
    ),
  },
  {
    heading: "Use of Facilities and Equipment",
    content: (
      <>
        Members agree to use all facilities and equipment responsibly and in
        accordance with provided instructions. Any damage caused through misuse,
        negligence, or intentional acts may result in liability, suspension, or
        termination of membership without refund.
      </>
    ),
  },
  {
    heading: "Personal Property",
    content: (
      <>
        The gym accepts no responsibility or liability for loss, theft, or
        damage to personal belongings brought onto the premises.
      </>
    ),
  },
  {
    heading: "Conduct and Compliance",
    content: (
      <>
        Members must conduct themselves in a respectful and lawful manner at all
        times. The gym reserves the right to refuse access, suspend, or
        terminate membership for misconduct or breach of these terms without any
        obligation to refund payments.
      </>
    ),
  },
  {
    heading: "Limitation of Liability",
    content: (
      <>
        To the fullest extent permitted by law, the gym, its owners, employees,
        and agents shall not be liable for any direct, indirect, incidental, or
        consequential damages arising from the use of its facilities or
        services.
      </>
    ),
  },
  {
    heading: "Amendments and Governing Law",
    content: (
      <>
        The gym reserves the right to amend these terms, operating hours,
        services, or pricing at any time without prior notice. These Terms and
        Conditions shall be governed and construed in accordance with applicable
        local laws. Continued use of the gym constitutes acceptance of any
        updated terms.
      </>
    ),
  },
];

const TermsPage = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <HeadingText className="text-default">Terms and Conditions</HeadingText>
      <p className="mb-4 text-[14px]">
        {" "}
        These Terms and Conditions govern the use of all gym facilities,
        services, memberships, training programs, and related offerings. By
        registering, making payment, or using any part of the gym, you
        acknowledge that you have read, understood, and agreed to be bound by
        these Terms and Conditions.
      </p>
      <ol>
        {termsAndConditions.map((t, id) => {
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

export default TermsPage;
