"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import ArchiveEventForm from "@/components/content/ArchiveEventForm";
import GalleryPicker from "@/components/content/GalleryPicker";
import ImageUploader from "@/components/content/ImageUploader";
import FormCard from "@/components/FormCard";
import FolderCard from "@/components/content/FolderCard";
import NewFolderModal from "@/components/content/NewFolderModal";
import Link from "next/link";
import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { ADMIN_ARCHIVE, PUBLIC_ARCHIVE } from "@/constants/routes";
import {
  ArchiveEventInput,
  useDeleteArchiveEventMutation,
  useGetArchiveEventQuery,
  useRemoveArchiveImageMutation,
  useSetArchiveCoverMutation,
  useUpdateArchiveEventMutation,
} from "@/redux/api-slices/content.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { cldImage } from "@/utils/images";
import {
  ArrowRight2,
  DocumentUpload,
  Export,
  Folder2,
  FolderAdd,
  Gallery,
  GalleryAdd,
  Star1,
  Trash,
} from "iconsax-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Result = {
  data?: { success?: boolean; message?: string; error?: string };
  error?: unknown;
};

const notify = (res: Result, onSuccess?: () => void) => {
  if (res.error && isFetchBaseQueryError(res.error as never)) {
    toast.error(
      ((res.error as { data?: ErrorResponse }).data as ErrorResponse)?.error ||
        DEFAULT_ERROR_MESSAGE
    );
  } else if (res.data?.success) {
    toast.success(res.data.message || "Done");
    fetch("/admin/api/revalidate?tag=archive").catch(() => null);
    onSuccess?.();
  } else {
    toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
  }
};

const ArchiveFolderPage = () => {
  const { id } = useParams() as { id: string };

  const router = useRouter();

  const { data, isLoading, isError, refetch } = useGetArchiveEventQuery(id);

  const event = data?.data;

  const [form, setForm] = useState<ArchiveEventInput | null>(null);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description || "",
        eventDate: moment(event.eventDate).format("YYYY-MM-DD"),
        isPublished: event.isPublished,
      });
    }
  }, [event]);

  const [update, updateStatus] = useUpdateArchiveEventMutation();

  const [remove] = useRemoveArchiveImageMutation();

  const [setCover] = useSetArchiveCoverMutation();

  const [deleteFolder, deleteStatus] = useDeleteArchiveEventMutation();

  const [showUploader, setShowUploader] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);

  const [subfolderOpen, setSubfolderOpen] = useState(false);

  const dirty =
    !!event &&
    !!form &&
    (form.title !== event.title ||
      form.description !== (event.description || "") ||
      form.eventDate !== moment(event.eventDate).format("YYYY-MM-DD") ||
      form.isPublished !== event.isPublished);

  const coverId = event?.coverImage?._id || event?.images?.[0]?._id;

  if (isLoading || isError || !event || !form) {
    return (
      <SectionLoader
        loading={isLoading}
        error={isError || (!isLoading && !event)}
        refetch={refetch}
      />
    );
  }

  const draftAncestor = event.ancestors.find((a) => !a.isPublished);

  const hasContent =
    event.images.length > 0 ||
    event.subfolders.some((f) => f.isPublished && f.totalImageCount > 0);

  const onWebsite = event.isPublished && !draftAncestor && hasContent;

  const canNest = event.depth < event.maxDepth;

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Folder path" className="flex flex-wrap items-center gap-1 text-[13px] text-gray-500 -mb-2">
        <Link href={ADMIN_ARCHIVE} className="hover:text-default hover:underline">
          Archive
        </Link>
        {event.ancestors.map((a) => (
          <React.Fragment key={a._id}>
            <ArrowRight2 size={12} color="currentColor" />
            <Link href={`${ADMIN_ARCHIVE}/${a._id}`} className="hover:text-default hover:underline truncate max-w-[180px]">
              {a.title}
            </Link>
          </React.Fragment>
        ))}
        <ArrowRight2 size={12} color="currentColor" />
        <span className="font-semibold text-gray-800 truncate max-w-[220px]">{event.title}</span>
      </nav>

      <FormCard
        title="Event details"
        description={
          !event.isPublished
            ? "Draft: only admins can see this folder."
            : draftAncestor
            ? `Published, but hidden on the website because "${draftAncestor.title}" above it is a draft.`
            : !hasContent
            ? "Published, but hidden on the website until it (or a published subfolder) has images."
            : "Published: this folder is visible on the website."
        }
      >
        <ArchiveEventForm value={form} onChange={setForm} />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-1">
            <Alert
              title="Delete this folder?"
              description={
                event.descendantCount > 0
                  ? `This also deletes the ${event.descendantCount} subfolder${event.descendantCount === 1 ? "" : "s"} inside it. They're removed from the archive and the website; their images stay in the gallery.`
                  : "The folder is removed from the archive and the website. Its images stay in the gallery."
              }
              loading={deleteStatus.isLoading}
              onContinueClick={async () =>
                notify((await deleteFolder(event._id)) as Result, () =>
                  router.replace(
                    event.parent ? `${ADMIN_ARCHIVE}/${event.parent}` : ADMIN_ARCHIVE
                  )
                )
              }
              alertTrigger={
                <button className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50">
                  <Trash size={16} color="currentColor" />
                  Delete folder
                </button>
              }
            />
            {onWebsite && (
              <a
                href={`${PUBLIC_ARCHIVE}/${event.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Export size={16} color="currentColor" />
                View on website
              </a>
            )}
          </div>
          <Button
            label="Save changes"
            fullRadius
            disabled={!dirty || form.title.trim().length < 2}
            loading={updateStatus.isLoading}
            onClick={async () =>
              notify(
                (await update({
                  id: event._id,
                  ...form,
                  title: form.title.trim(),
                })) as Result
              )
            }
          />
        </div>
      </FormCard>

      <FormCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-bold tracking-tight">
              Subfolders ({event.subfolders.length})
            </h2>
            <p className="text-[12px] text-gray-500">
              {canNest
                ? "Group photos inside this event, for example one folder per day or activity."
                : `Folders can only be nested ${event.maxDepth} levels deep.`}
            </p>
          </div>
          {canNest && (
            <Button
              label="New subfolder"
              icon={FolderAdd}
              variant="outlined"
              color="black"
              size="sm"
              fullRadius
              onClick={() => setSubfolderOpen(true)}
            />
          )}
        </div>
        {event.subfolders.length === 0 ? (
          <p className="flex items-center gap-2 rounded-[14px] border border-dashed border-gray-300 px-4 py-3 text-[13px] text-gray-500">
            <Folder2 size={18} color="currentColor" variant="Bulk" />
            No subfolders yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6">
            {event.subfolders.map((sub) => (
              <li key={sub._id}>
                <FolderCard event={sub} />
              </li>
            ))}
          </ul>
        )}
      </FormCard>

      <FormCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[16px] font-bold tracking-tight">
              Images ({event.images.length})
            </h2>
            <p className="text-[12px] text-gray-500">
              The cover is shown on top of the photo stack on the website.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              label="Add from gallery"
              icon={GalleryAdd}
              variant="outlined"
              color="black"
              size="sm"
              fullRadius
              onClick={() => setPickerOpen(true)}
            />
            <Button
              label={showUploader ? "Hide upload" : "Upload images"}
              icon={DocumentUpload}
              size="sm"
              fullRadius
              onClick={() => setShowUploader((v) => !v)}
            />
          </div>
        </div>

        {showUploader && (
          <div className="mb-5">
            <ImageUploader
              compact
              eventId={event._id}
              onUploaded={() => setShowUploader(false)}
            />
          </div>
        )}

        {event.images.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-gray-300 p-10 text-center">
            <span className="size-12 rounded-full bg-default/10 inline-flex items-center justify-center mb-2">
              <Gallery size={24} color="var(--color-default)" variant="Bulk" />
            </span>
            <p className="font-semibold text-[14px]">This folder is empty</p>
            <p className="text-[12px] text-gray-500 mt-1">
              Upload new images or add some from the gallery.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {event.images.map((image) => {
              const isCover = image._id === coverId;

              return (
                <li
                  key={image._id}
                  className={`group relative aspect-square rounded-[14px] overflow-hidden bg-gray-100 border-2 ${
                    isCover ? "border-default" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cldImage(image.url, { width: 400, height: 400 })}
                    alt={image.caption || ""}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {isCover && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-default px-2 py-0.5 text-[10px] font-semibold text-white">
                      <Star1 size={11} color="currentColor" variant="Bold" />
                      Cover
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition">
                    {!isCover && (
                      <button
                        title="Set as cover"
                        aria-label="Set as cover"
                        onClick={async () =>
                          notify(
                            (await setCover({
                              id: event._id,
                              imageId: image._id,
                            })) as Result
                          )
                        }
                        className="size-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                      >
                        <Star1 size={16} color="var(--color-default)" />
                      </button>
                    )}
                    <button
                      title="Remove from folder"
                      aria-label="Remove from folder"
                      onClick={async () =>
                        notify(
                          (await remove({
                            id: event._id,
                            imageId: image._id,
                          })) as Result
                        )
                      }
                      className="size-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                    >
                      <Trash size={16} color="var(--color-rose-500)" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-[11px] text-gray-500 mt-3">
          Removing an image only takes it out of this folder; it stays in the
          gallery.
        </p>
      </FormCard>

      <NewFolderModal
        open={subfolderOpen}
        setOpen={setSubfolderOpen}
        parent={event._id}
        parentTitle={event.title}
      />

      <GalleryPicker
        open={pickerOpen}
        setOpen={setPickerOpen}
        eventId={event._id}
        existingIds={event.images.map((i) => i._id)}
      />
    </div>
  );
};

export default ArchiveFolderPage;
