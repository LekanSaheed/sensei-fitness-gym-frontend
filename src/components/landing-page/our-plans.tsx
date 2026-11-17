"use client";
import React, { useEffect, useState } from "react";
import { ISubscriptionPlan } from "@/redux/api-slices/subscription.slice";
import FormatNumber from "@/utils/format-number";
import Link from "next/link";
import { SIGNUP } from "@/constants/routes";
import SectionHeader from "./section-header";
import { ArrowRight2, Clock } from "iconsax-react";
import moment from "moment";

const OurPlans = ({ plans = [] }: { plans: ISubscriptionPlan[] }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Decided in the browser so server and client render the same HTML
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => setToday(moment().format("dddd")), []);

  return (
    <section
      id="plans"
      className="scroll-mt-24 bg-default-black py-20 md:py-28 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Membership"
          title={
            <>
              Our <span className="text-default">plans</span>
            </>
          }
          description="See our plans customized to your pocket and time"
        />

        {plans.length > 3 && (
          <p className="text-right text-[12px] uppercase tracking-[0.2em] text-white/40 mb-3">
            {plans.length} plans · scroll to see all →
          </p>
        )}

        {plans.length === 0 ? (
          <p className="text-center text-white/50 text-[14px]">
            Plans will be available soon.
          </p>
        ) : (
          <div className="-mx-4 px-4 flex overflow-x-auto scroll-con pb-4 snap-x snap-mandatory gap-4">
            {plans.map((plan, id) => {
              // Plans aren't ranked, so none is highlighted as "recommended"
              const featured = false;

              return (
                <div
                  key={id}
                  className={`relative w-[82%] sm:w-[48%] lg:w-[31.8%] shrink-0 snap-start rounded-[28px] p-6 md:p-7 flex flex-col transition hover:-translate-y-1 ${
                    featured
                      ? "bg-default text-black"
                      : "border border-white/10 bg-white/[0.03] hover:border-default/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="font-league uppercase text-[30px] leading-none tracking-tight">
                      {plan.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        featured
                          ? "bg-black text-default"
                          : "bg-default/15 text-default"
                      }`}
                    >
                      {plan.durationInDays} day
                      {plan.durationInDays > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p
                    className={`text-[14px] leading-relaxed flex-1 ${
                      featured ? "text-black/75" : "text-white/60"
                    }`}
                  >
                    {plan?.description}
                  </p>
                  <p className="font-league text-[48px] leading-none mt-6 mb-6">
                    {FormatNumber.ngnAmount(plan.price)}
                  </p>
                  <Link
                    href={SIGNUP}
                    className={`inline-flex items-center justify-center gap-2 rounded-full py-3 font-league uppercase text-[20px] tracking-wide transition active:scale-[0.97] ${
                      featured
                        ? "bg-black text-white hover:bg-black/85"
                        : "bg-default text-white hover:brightness-110"
                    }`}
                  >
                    Get started
                    <ArrowRight2 size={18} color="currentColor" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-20">
          <SectionHeader
            eyebrow="Plan your visit"
            title={
              <>
                Opening hours <span className="text-default">& schedules</span>
              </>
            }
          />

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {days.map((day, id) => {
              const closed = id === 6;

              const isToday = day === today;

              return (
                <li
                  key={id}
                  className={`relative rounded-[20px] p-5 border ${
                    isToday
                      ? "border-default bg-default/10"
                      : "border-white/10 bg-white/[0.03]"
                  } ${closed ? "opacity-60" : ""}`}
                >
                  {isToday && (
                    <span className="absolute top-3 right-3 rounded-full bg-default px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
                      Today
                    </span>
                  )}
                  <p className="font-league uppercase text-[26px] leading-none text-default mb-3">
                    {day}
                  </p>
                  {closed ? (
                    <p className="text-[13px] text-default-tertiary">Closed</p>
                  ) : (
                    <div className="text-[13px] text-white/75 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Clock size={14} color="var(--color-default)" />
                        Morning: 7am - 11am
                      </p>
                      {day?.toLowerCase() !== "saturday" && (
                        <p className="flex items-center gap-1.5">
                          <Clock size={14} color="var(--color-default)" />
                          Evening: 5pm - 9pm
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OurPlans;
