import ArchivePhotos from "@/components/landing-page/archive-photos";
import { PUBLIC_ARCHIVE } from "@/constants/routes";
import { fetchPublicArchiveEvent } from "@/utils/archive";
import { cldImage } from "@/utils/images";
import moment from "moment";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type Props = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const event = await fetchPublicArchiveEvent((await params).slug);

  if (!event) return { title: "Event not found | SEN-SEI Fitness" };

  return {
    title: `${event.title} | SEN-SEI Fitness`,
    description:
      event.description?.slice(0, 160) ||
      `Photos from ${event.title} at SEN-SEI Fitness.`,
    openGraph: event.coverImage
      ? { images: [cldImage(event.coverImage.url, { width: 1200, height: 630 })] }
      : undefined,
  };
};

const ArchiveEventPage = async ({ params }: Props) => {
  const event = await fetchPublicArchiveEvent((await params).slug);

  if (!event || !event.images.length) notFound();

  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-24 md:pt-12">
      <div className="pointer-events-none absolute right-0 top-0 size-[420px] rounded-full bg-default/10 blur-[120px]" />
      <div className="container mx-auto max-w-7xl relative">
        <Link
          href={PUBLIC_ARCHIVE}
          className="inline-flex items-center gap-2 text-[13px] text-white/60 hover:text-default mb-8"
        >
          <span aria-hidden>←</span> All events
        </Link>

        <header className="mb-10 md:mb-14 max-w-[760px]">
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-default mb-3">
            {moment(event.eventDate).format("MMMM D, YYYY")} ·{" "}
            {event.images.length} photo{event.images.length === 1 ? "" : "s"}
          </p>
          <h1 className="font-league uppercase leading-[0.95] tracking-tight text-[46px] md:text-[64px] lg:text-[76px]">
            {event.title}
          </h1>
          {event.description && (
            <p className="mt-4 text-[14px] md:text-[16px] text-white/60 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          )}
        </header>

        <ArchivePhotos images={event.images} title={event.title} />
      </div>
    </section>
  );
};

export default ArchiveEventPage;
