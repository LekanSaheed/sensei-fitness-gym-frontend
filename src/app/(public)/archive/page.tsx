import ArchiveCard from "@/components/landing-page/archive-card";
import SectionHeader from "@/components/landing-page/section-header";
import { fetchPublicArchive } from "@/utils/archive";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Archive | SEN-SEI Fitness",
  description: "Photos from past SEN-SEI Fitness events.",
};

const ArchivePage = async () => {
  const { events } = await fetchPublicArchive();

  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-24 md:pt-16">
      <div className="pointer-events-none absolute right-0 top-0 size-[420px] rounded-full bg-default/10 blur-[120px]" />
      <div className="container mx-auto max-w-7xl relative">
        <SectionHeader
          eyebrow="The archive"
          title={
            <>
              Past <span className="text-default">Events</span>
            </>
          }
          description="Every bootcamp, challenge and community day we've captured. Pick an event to see its photos."
        />

        {events.length === 0 ? (
          <p className="text-center text-white/50 py-16">
            No events yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {events.map((event) => (
              <li key={event._id}>
                <ArchiveCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ArchivePage;
