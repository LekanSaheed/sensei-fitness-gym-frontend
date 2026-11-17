"use client";

import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import {
  useAddArchiveImagesMutation,
  useGetGalleryQuery,
} from "@/redux/api-slices/content.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { cldImage } from "@/utils/images";
import { ArrowLeft2, ArrowRight2, Gallery, TickCircle } from "iconsax-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

/** Pick existing gallery images to add to an archive folder */
const GalleryPicker = ({
  open,
  setOpen,
  eventId,
  existingIds,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventId: string;
  existingIds: string[];
}) => {
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<string[]>([]);

  const { data, isLoading, isFetching, isError, refetch } = useGetGalleryQuery(
    { page, limit: 30 },
    { skip: !open }
  );

  const images = data?.data?.data || [];

  const info = data?.data?.paginationInfo;

  const [add, addStatus] = useAddArchiveImagesMutation();

  useEffect(() => {
    if (!open) {
      setSelected([]);
      setPage(1);
    }
  }, [open]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const submit = async () => {
    const res = await add({ id: eventId, imageIds: selected });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      toast.error(
        (res.error.data as ErrorResponse)?.error || DEFAULT_ERROR_MESSAGE
      );
    } else if (res.data?.success) {
      toast.success(res.data.message || "Added");
      fetch("/admin/api/revalidate?tag=archive").catch(() => null);
      setOpen(false);
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <DialogModal
      open={open}
      setOpen={setOpen}
      title="Add from gallery"
      description="Tap images to select them. Images already in this folder are marked."
      icon={Gallery}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-gray-600">
            {info && info.totalPages > 1 && (
              <>
                <button
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="size-8 rounded-full border border-gray-200 flex items-center justify-center disabled:text-gray-300"
                >
                  <ArrowLeft2 size={16} color="currentColor" />
                </button>
                <span className="tabular-nums">
                  {page}/{info.totalPages}
                </span>
                <button
                  aria-label="Next page"
                  disabled={!info.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="size-8 rounded-full border border-gray-200 flex items-center justify-center disabled:text-gray-300"
                >
                  <ArrowRight2 size={16} color="currentColor" />
                </button>
              </>
            )}
          </div>
          <Button
            label={
              selected.length
                ? `Add ${selected.length} image${selected.length === 1 ? "" : "s"}`
                : "Select images"
            }
            fullRadius
            disabled={!selected.length}
            loading={addStatus.isLoading}
            onClick={submit}
          />
        </div>
      }
    >
      <SectionLoader
        loading={isLoading || (isFetching && !images.length)}
        error={isError}
        refetch={refetch}
      />

      {!isLoading && !isError && images.length === 0 && (
        <p className="text-center text-[13px] text-gray-500 py-10">
          The gallery is empty. Upload images from this folder instead.
        </p>
      )}

      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((image) => {
          const inFolder = existingIds.includes(image._id);

          const isSelected = selected.includes(image._id);

          return (
            <li key={image._id}>
              <button
                type="button"
                disabled={inFolder}
                aria-pressed={isSelected}
                onClick={() => toggle(image._id)}
                className={`relative block w-full aspect-square rounded-[12px] overflow-hidden bg-gray-100 border-2 transition ${
                  isSelected
                    ? "border-default ring-4 ring-default/20"
                    : "border-transparent"
                } ${inFolder ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldImage(image.url, { width: 300, height: 300 })}
                  alt={image.caption || ""}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {(isSelected || inFolder) && (
                  <span className="absolute top-1.5 right-1.5 rounded-full bg-white">
                    <TickCircle
                      size={22}
                      variant="Bold"
                      color={
                        inFolder
                          ? "var(--color-gray-500)"
                          : "var(--color-default)"
                      }
                    />
                  </span>
                )}
                {inFolder && (
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] py-0.5">
                    Already added
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </DialogModal>
  );
};

export default GalleryPicker;
