import ArchivePhotos from "@/components/landing-page/archive-photos";
import ArchiveCard from "@/components/landing-page/archive-card";
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

  if (!event || (!event.images.length && !event.subfolders?.length)) notFound();

  const parent = event.ancestors?.[event.ancestors.length - 1];

  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-24 md:pt-12">
      <div className="pointer-events-none absolute right-0 top-0 size-[420px] rounded-full bg-default/10 blur-[120px]" />
      <div className="container mx-auto max-w-7xl relative">
        <nav
          aria-label="Archive path"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/60 mb-8"
        >
          <Link
            href={parent ? `${PUBLIC_ARCHIVE}/${parent.slug}` : PUBLIC_ARCHIVE}
            className="inline-flex items-center gap-2 hover:text-default mr-2"
          >
            <span aria-hidden>←</span> Back
          </Link>
          <Link href={PUBLIC_ARCHIVE} className="hover:text-default">
            All events
          </Link>
          {(event.ancestors || []).map((a) => (
            <React.Fragment key={a.slug}>
              <span aria-hidden className="text-white/30">/</span>
              <Link href={`${PUBLIC_ARCHIVE}/${a.slug}`} className="hover:text-default">
                {a.title}
              </Link>
            </React.Fragment>
          ))}
          <span aria-hidden className="text-white/30">/</span>
          <span className="text-white/90">{event.title}</span>
        </nav>

        <header className="mb-10 md:mb-14 max-w-[760px]">
          <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-default mb-3">
            {moment(event.eventDate).format("MMMM D, YYYY")}
            {event.images.length > 0 &&
              ` · ${event.images.length} photo${event.images.length === 1 ? "" : "s"}`}
            {event.subfolders?.length > 0 &&
              ` · ${event.subfolders.length} album${event.subfolders.length === 1 ? "" : "s"}`}
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

        {event.subfolders?.length > 0 && (
          <div className="mb-14">
            {event.images.length > 0 && (
              <h2 className="font-league uppercase text-[30px] md:text-[36px] leading-none mb-8">
                Albums
              </h2>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
              {event.subfolders.map((sub) => (
                <li key={sub._id}>
                  <ArchiveCard event={sub} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {event.images.length > 0 && (
          <>
            {event.subfolders?.length > 0 && (
              <h2 className="font-league uppercase text-[30px] md:text-[36px] leading-none mb-8">
                Photos
              </h2>
            )}
            <ArchivePhotos images={event.images} title={event.title} />
          </>
        )}
      </div>
    </section>
  );
};

export default ArchiveEventPage;
