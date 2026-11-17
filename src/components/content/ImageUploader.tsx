"use client";

import Button from "@/components/button";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { useUploadGalleryImagesMutation } from "@/redux/api-slices/content.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { compressImage } from "@/utils/images";
import { CloseCircle, DocumentUpload } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MAX_FILES = 20;

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Drag & drop / pick images and upload them to the gallery. With `eventId`,
 * the uploaded images are also added to that archive folder.
 */
const ImageUploader = ({
  eventId,
  onUploaded,
  compact = false,
}: {
  eventId?: string;
  onUploaded?: (count: number) => void;
  compact?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);

  const [previews, setPreviews] = useState<string[]>([]);

  const [dragging, setDragging] = useState(false);

  const [preparing, setPreparing] = useState(false);

  const [upload, uploadStatus] = useUploadGalleryImagesMutation();

  // Object URLs for thumbnails; revoked when the list changes
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));

    setPreviews(urls);

    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);

    const images = incoming.filter((f) => ACCEPTED.includes(f.type));

    if (images.length < incoming.length) {
      toast.error("Only JPG, PNG and WebP images can be uploaded");
    }

    setFiles((prev) => {
      const next = [...prev, ...images];

      if (next.length > MAX_FILES) {
        toast.error(`You can upload up to ${MAX_FILES} images at a time`);
      }

      return next.slice(0, MAX_FILES);
    });
  };

  const submit = async () => {
    if (!files.length) return;

    setPreparing(true);

    const prepared = await Promise.all(files.map(compressImage));

    setPreparing(false);

    const body = new FormData();

    prepared.forEach((f) => body.append("images", f));

    if (eventId) body.append("eventId", eventId);

    const res = await upload(body);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      toast.error(
        (res.error.data as ErrorResponse)?.error || DEFAULT_ERROR_MESSAGE
      );
      return;
    }

    if (res.data?.success) {
      toast.success(res.data.message || "Uploaded");

      setFiles([]);

      if (eventId) fetch("/admin/api/revalidate?tag=archive").catch(() => null);

      onUploaded?.(res.data.data?.uploaded.length || 0);
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  const busy = preparing || uploadStatus.isLoading;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-[18px] border-2 border-dashed text-center transition ${
          compact ? "p-5" : "p-8"
        } ${
          dragging
            ? "border-default bg-default/[0.06]"
            : "border-gray-300 hover:border-default/60 bg-white"
        }`}
      >
        <span className="size-12 rounded-full bg-default/10 inline-flex items-center justify-center mb-2">
          <DocumentUpload size={24} color="var(--color-default)" variant="Bulk" />
        </span>
        <p className="text-[14px] font-semibold">
          Drop images here or <span className="text-default">browse</span>
        </p>
        <p className="text-[12px] text-gray-500 mt-0.5">
          JPG, PNG or WebP · up to {MAX_FILES} at a time · large photos are
          resized automatically
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <ul className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {previews.map((src, i) => (
              <li
                key={src}
                className="relative aspect-square rounded-[10px] overflow-hidden bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {!busy && (
                  <button
                    aria-label="Remove image"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="absolute top-1 right-1 size-6 rounded-full bg-black/60 flex items-center justify-center"
                  >
                    <CloseCircle size={16} color="#fff" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <p className="text-[12px] text-gray-500">
              {files.length} image{files.length === 1 ? "" : "s"} selected
              {eventId ? " · they'll be added to the gallery and this folder" : ""}
            </p>
            <div className="flex gap-2">
              <Button
                label="Clear"
                variant="outlined"
                color="black"
                size="sm"
                fullRadius
                disabled={busy}
                onClick={() => setFiles([])}
              />
              <Button
                label={preparing ? "Preparing…" : `Upload ${files.length}`}
                size="sm"
                fullRadius
                loading={uploadStatus.isLoading}
                disabled={busy}
                onClick={submit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
