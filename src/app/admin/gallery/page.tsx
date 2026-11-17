"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import ImageUploader from "@/components/content/ImageUploader";
import DialogModal from "@/components/dialog-modal";
import FormCard from "@/components/FormCard";
import Input from "@/components/input";
import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { ADMIN_ARCHIVE } from "@/constants/routes";
import { useUserCanPerformAction } from "@/hooks/usePermissions";
import {
  useDeleteGalleryImageMutation,
  useGetGalleryQuery,
  useUpdateGalleryCaptionMutation,
} from "@/redux/api-slices/content.slice";
import { ErrorResponse } from "@/types";
import { GalleryImage } from "@/types/Content";
import { isFetchBaseQueryError } from "@/utils";
import { cldImage } from "@/utils/images";
import { ArrowLeft2, ArrowRight2, Folder2, Gallery } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PAGE_SIZE = 24;

const GalleryPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useGetGalleryQuery({
    page,
    limit: PAGE_SIZE,
  });

  const images = data?.data?.data || [];

  const info = data?.data?.paginationInfo;

  const [selected, setSelected] = useState<GalleryImage | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <FormCard
        title="Upload images"
        description="Images you upload here can be added to archive folders and shown on the website."
      >
        <ImageUploader onUploaded={() => setPage(1)} />
      </FormCard>

      <section>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-[16px] font-bold tracking-tight">All images</h2>
            <p className="text-[12px] text-gray-500">
              {info?.totalItems ?? 0} image
              {info?.totalItems === 1 ? "" : "s"} · click an image to edit or
              delete it
            </p>
          </div>
        </div>

        <SectionLoader
          loading={isLoading || (isFetching && !images.length)}
          error={isError}
          refetch={refetch}
        />

        {!isLoading && !isError && images.length === 0 && (
          <div className="rounded-[18px] bg-white border border-gray-200/80 p-10 text-center">
            <span className="size-14 rounded-full bg-default/10 inline-flex items-center justify-center mb-3">
              <Gallery size={26} color="var(--color-default)" variant="Bulk" />
            </span>
            <p className="font-semibold">No images yet</p>
            <p className="text-[13px] text-gray-500 mt-1">
              Upload your first photos above.
            </p>
          </div>
        )}

        {images.length > 0 && (
          <ul
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 transition ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {images.map((image) => (
              <li key={image._id}>
                <button
                  onClick={() => setSelected(image)}
                  className="group relative block w-full aspect-square rounded-[14px] overflow-hidden bg-gray-100 border border-gray-200/80 focus:outline-none focus:ring-4 focus:ring-default/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cldImage(image.url, { width: 400, height: 400 })}
                    alt={image.caption || "Gallery image"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {!!image.folders?.length && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                      <Folder2 size={11} color="currentColor" variant="Bold" />
                      {image.folders.length}
                    </span>
                  )}
                  {image.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6 text-left text-[11px] text-white truncate">
                      {image.caption}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {info && info.totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-[12px] text-gray-600 tabular-nums">
              Page {info.currentPage} of {info.totalPages}
            </span>
            <div className="bg-white border border-gray-200 inline-flex rounded-full p-0.5">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="size-9 rounded-full flex items-center justify-center hover:bg-default hover:text-white disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <ArrowLeft2 size={18} color="currentColor" />
              </button>
              <button
                aria-label="Next page"
                disabled={!info.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="size-9 rounded-full flex items-center justify-center hover:bg-default hover:text-white disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <ArrowRight2 size={18} color="currentColor" />
              </button>
            </div>
          </div>
        )}
      </section>

      <ImageDetailsModal image={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

const ImageDetailsModal = ({
  image,
  onClose,
}: {
  image: GalleryImage | null;
  onClose: () => void;
}) => {
  const canManage = useUserCanPerformAction()(["manage_gallery"]);

  const [caption, setCaption] = useState("");

  useEffect(() => setCaption(image?.caption || ""), [image]);

  const [updateCaption, captionStatus] = useUpdateGalleryCaptionMutation();

  const [deleteImage, deleteStatus] = useDeleteGalleryImageMutation();

  const handle = async (
    run: () => Promise<{ data?: { success?: boolean; message?: string; error?: string }; error?: unknown }>,
    after?: () => void
  ) => {
    const res = await run();

    if (res.error && isFetchBaseQueryError(res.error as never)) {
      toast.error(
        ((res.error as { data?: ErrorResponse }).data as ErrorResponse)
          ?.error || DEFAULT_ERROR_MESSAGE
      );
    } else if (res.data?.success) {
      toast.success(res.data.message || "Done");
      fetch("/admin/api/revalidate?tag=archive").catch(() => null);
      after?.();
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <DialogModal
      open={!!image}
      setOpen={(open) => !open && onClose()}
      title="Image details"
      description={
        image?.createdAt
          ? `Uploaded ${moment(image.createdAt).format("ll")}${
              image.uploadedBy
                ? ` by ${image.uploadedBy.firstname} ${image.uploadedBy.lastname}`
                : ""
            }`
          : undefined
      }
      icon={Gallery}
      size="lg"
      footer={
        canManage ? (
          <div className="flex items-center justify-between gap-2">
            <Alert
              title="Delete this image?"
              description={
                image?.folders?.length
                  ? `It will also be removed from ${image.folders.length} archive folder${image.folders.length === 1 ? "" : "s"}. This can't be undone.`
                  : "This can't be undone."
              }
              loading={deleteStatus.isLoading}
              onContinueClick={() =>
                image &&
                handle(() => deleteImage(image._id) as never, onClose)
              }
              alertTrigger={
                <button className="rounded-full px-4 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50">
                  Delete image
                </button>
              }
            />
            <Button
              label="Save caption"
              fullRadius
              loading={captionStatus.isLoading}
              disabled={caption.trim() === (image?.caption || "")}
              onClick={() =>
                image &&
                handle(
                  () =>
                    updateCaption({ id: image._id, caption: caption.trim() }) as never
                )
              }
            />
          </div>
        ) : undefined
      }
    >
      {image && (
        <div>
          <div className="rounded-[14px] overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldImage(image.url, { width: 1200, crop: "limit" })}
              alt={image.caption || "Gallery image"}
              className="w-full max-h-[50vh] object-contain"
            />
          </div>

          {canManage ? (
            <div className="mt-4">
              <Input
                label="Caption (optional)"
                placeholder="e.g. Saturday bootcamp warm-up"
                value={caption}
                maxLength={200}
                onChange={(e) => setCaption(e.target.value)}
                remove_margin
              />
            </div>
          ) : (
            image.caption && <p className="mt-3 text-[13px]">{image.caption}</p>
          )}

          <div className="mt-4">
            <p className="text-[12px] font-semibold text-gray-700 mb-1.5">
              In archive folders
            </p>
            {image.folders?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {image.folders.map((f) => (
                  <Link
                    key={f._id}
                    href={`${ADMIN_ARCHIVE}/${f._id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-default/10 border border-default/30 px-2.5 py-1 text-[12px] text-default-secondary hover:bg-default/20"
                  >
                    <Folder2 size={12} color="currentColor" variant="Bold" />
                    {f.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-500">
                Not in any folder yet.
              </p>
            )}
          </div>
        </div>
      )}
    </DialogModal>
  );
};

export default GalleryPage;
