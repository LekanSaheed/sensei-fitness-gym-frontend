"use client";

import ActivityZoneBadge from "@/components/ActivityZoneBadge";
import Heading from "@/components/Heading";
import SectionLoader from "@/components/SectionLoader";
import { MEMBERS } from "@/constants/routes";
import { useGetInactivityFeedbackSummaryQuery } from "@/redux/api-slices/admin.slice";
import moment from "moment";
import Link from "next/link";
import React from "react";

/** Admin view of why members say they've been inactive. */
const InactivityReasonsCard = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetInactivityFeedbackSummaryQuery(null);

  const loading = isLoading || isFetching;

  const summary = data?.data;

  const max = Math.max(1, ...(summary?.reasons || []).map((r) => r.count));

  return (
    <section className="mt-6 border rounded-[15px] bg-white p-4">
      <div className="flex items-center justify-between gap-2 mb-1">
        <Heading className="!mb-0">Why members are inactive</Heading>
        {!!summary?.total && (
          <span className="text-[12px] text-gray-500">
            {summary.total} response{summary.total === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <p className="text-[12px] text-gray-500 mb-4">
        Answers from the link in activity reminder emails.
      </p>

      <SectionLoader loading={loading && !summary} error={isError} refetch={refetch} />

      {summary && summary.total === 0 && (
        <p className="text-[13px] text-gray-500 py-4 text-center">
          No responses yet. Members can answer from their reminder emails.
        </p>
      )}

      {summary && summary.total > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ul className="grid gap-2">
            {summary.reasons.map((r) => (
              <li key={r.value} className="text-[12px]">
                <div className="flex justify-between mb-1">
                  <span>{r.label}</span>
                  <span className="font-semibold">{r.count}</span>
                </div>
                <div className="h-[6px] rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-default"
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div>
            <p className="text-[12px] font-semibold mb-2">Latest responses</p>
            <ul className="grid gap-2">
              {summary.recent.map((f) => (
                <li key={f._id} className="border rounded-[10px] p-3 text-[12px]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {f.user ? (
                      <Link
                        href={`${MEMBERS}/${f.user._id}?name=${f.user.firstname} ${f.user.lastname}`}
                        className="font-semibold text-default hover:underline"
                      >
                        {f.user.firstname} {f.user.lastname}
                      </Link>
                    ) : (
                      <span className="font-semibold">Deleted member</span>
                    )}
                    <span className="text-gray-500">
                      {moment(f.updatedAt).fromNow()}
                    </span>
                  </div>
                  <p className="mt-1">{f.reasonLabel}</p>
                  {f.note && (
                    <p className="mt-1 text-gray-600 whitespace-pre-line break-words">
                      &ldquo;{f.note}&rdquo;
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-gray-500">
                    Zone when answered:
                    <ActivityZoneBadge zone={f.zoneAtSubmission} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default InactivityReasonsCard;
