import { PUBLIC_ARCHIVE } from "@/constants/routes";
import { ArchiveEventSummary } from "@/types/Content";
import Link from "next/link";
import React from "react";
import ArchiveCard from "./archive-card";
import SectionHeader from "./section-header";

/** Landing page: the latest past events, with a link to the full archive */
const ArchiveGlimpse = ({
  events,
  total,
}: {
  events: ArchiveEventSummary[];
  total: number;
}) => {
  if (!events.length) return null;

  return (
    <section
      id="archive"
      className="relative overflow-hidden bg-default-black py-20 md:py-28 px-4"
    >
      <div className="pointer-events-none absolute left-0 bottom-0 size-[420px] rounded-full bg-default/10 blur-[120px]" />
      <div className="container mx-auto max-w-7xl relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader
            align="left"
            eyebrow="From the archive"
            title={
              <>
                Past <span className="text-default">Events</span>
              </>
            }
            description="Bootcamps, challenges and community days: a look back at what we've done together."
            className="!mb-0 max-w-[560px]"
          />
          <Link
            href={PUBLIC_ARCHIVE}
            className="shrink-0 self-start md:self-auto inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.15em] hover:bg-default hover:border-default transition"
          >
            See more{total > events.length ? ` (${total})` : ""}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {events.map((event) => (
            <li key={event._id}>
              <ArchiveCard event={event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ArchiveGlimpse;
