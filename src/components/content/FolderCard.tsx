import PhotoStack from "@/components/content/PhotoStack";
import { ADMIN_ARCHIVE } from "@/constants/routes";
import { ArchiveEventSummary } from "@/types/Content";
import { Folder2 } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React from "react";

/** Admin archive folder: photo stack, title, date, contents and status */
const FolderCard = ({ event }: { event: ArchiveEventSummary }) => (
  <Link
    href={`${ADMIN_ARCHIVE}/${event._id}`}
    className="group block h-full rounded-[22px] bg-white border border-gray-200/80 p-4 pt-6 transition hover:border-default/40 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)]"
  >
    <div className="relative">
      <PhotoStack
        images={event.preview}
        count={event.totalImageCount}
        alt={event.title}
        className="mx-3"
      />
      {event.subfolderCount > 0 && (
        <span className="absolute -top-3 -right-1 z-10 inline-flex items-center gap-1 rounded-full bg-default-black px-2.5 py-1 text-[11px] font-semibold text-white shadow">
          <Folder2 size={12} color="currentColor" variant="Bold" />
          {event.subfolderCount}
        </span>
      )}
    </div>
    <div className="mt-6 flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="font-semibold text-[15px] truncate">{event.title}</p>
        <p className="text-[12px] text-gray-500">
          {moment(event.eventDate).format("ll")} · {event.imageCount} image
          {event.imageCount === 1 ? "" : "s"}
          {event.subfolderCount > 0 &&
            ` · ${event.subfolderCount} folder${event.subfolderCount === 1 ? "" : "s"}`}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          event.isPublished
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {event.isPublished ? "Published" : "Draft"}
      </span>
    </div>
  </Link>
);

export default FolderCard;
