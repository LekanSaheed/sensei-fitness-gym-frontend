"use client";

import { GalleryImage } from "@/types/Content";
import { cldImage } from "@/utils/images";
import { ArrowLeft2, ArrowRight2, CloseCircle } from "iconsax-react";
import React, { useCallback, useEffect, useState } from "react";

/** Photo grid for a public archive event, with a full-screen viewer */
const ArchivePhotos = ({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) => {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);

  const step = useCallback(
    (by: number) =>
      setIndex((i) =>
        i === null ? i : (i + by + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);

    const overflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, close, step]);

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [&>li]:mb-3 md:[&>li]:mb-4">
        {images.map((image, i) => (
          <li key={image._id} className="break-inside-avoid">
            <button
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-[16px] border border-white/10 bg-white/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-default/50"
              aria-label={`Open photo ${i + 1} of ${images.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldImage(image.url, { width: 600, crop: "limit" })}
                alt={image.caption || `${title}, photo ${i + 1}`}
                width={image.width}
                height={image.height}
                loading="lazy"
                className="w-full h-auto transition duration-500 group-hover:scale-[1.03]"
              />
              {image.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-8 text-left text-[12px] text-white/90">
                  {image.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/70 text-[13px]">
            <span className="tabular-nums">
              {index! + 1} / {images.length}
            </span>
            <button
              onClick={close}
              aria-label="Close"
              className="size-10 rounded-full flex items-center justify-center hover:bg-white/10"
            >
              <CloseCircle size={26} color="currentColor" />
            </button>
          </div>

          <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 md:px-16 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current._id}
              src={cldImage(current.url, { width: 1800, crop: "limit" })}
              alt={current.caption || title}
              className="max-h-full max-w-full object-contain rounded-[8px]"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 md:left-4 size-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-default"
                >
                  <ArrowLeft2 size={20} color="currentColor" />
                </button>
                <button
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 md:right-4 size-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-default"
                >
                  <ArrowRight2 size={20} color="currentColor" />
                </button>
              </>
            )}
          </div>

          {current.caption && (
            <p className="text-center text-white/80 text-[14px] px-4 pb-6">
              {current.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ArchivePhotos;
