import PhotoStack from "@/components/content/PhotoStack";
import { PUBLIC_ARCHIVE } from "@/constants/routes";
import { ArchiveEventSummary } from "@/types/Content";
import moment from "moment";
import Link from "next/link";
import React from "react";

/** A past event on the website: its photos as a stack, then title and date */
const ArchiveCard = ({ event }: { event: ArchiveEventSummary }) => (
  <Link
    href={`${PUBLIC_ARCHIVE}/${event.slug}`}
    className="group block focus:outline-none"
  >
    <PhotoStack
      images={event.preview}
      count={event.totalImageCount ?? event.imageCount}
      maxLayers={2}
      alt={event.title}
      className="mx-4 group-focus-visible:ring-4 group-focus-visible:ring-default/40 rounded-[18px]"
    />
    <div className="mt-7 px-1">
      <p className="text-[11px] uppercase tracking-[0.2em] text-default">
        {moment(event.eventDate).format("MMM D, YYYY")}
      </p>
      <h3 className="font-league uppercase text-[28px] leading-none mt-1.5 group-hover:text-default transition-colors">
        {event.title}
      </h3>
      <p className="text-[12px] text-white/50 mt-1.5">
        {(() => {
          const photos = event.totalImageCount ?? event.imageCount;

          return `${photos} photo${photos === 1 ? "" : "s"}`;
        })()}
        {event.subfolderCount > 0 &&
          ` · ${event.subfolderCount} album${event.subfolderCount === 1 ? "" : "s"}`}
      </p>
    </div>
  </Link>
);

export default ArchiveCard;
