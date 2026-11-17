import { GalleryImage } from "@/types/Content";
import { cldImage } from "@/utils/images";
import { Gallery } from "iconsax-react";
import React from "react";

/** Most cards drawn in a stack */
const MAX_LAYERS = 5;

/** Only the top cards load a real photo; the ones behind are plain cards */
const REAL_PHOTOS = 2;

/** Fan-out for each depth, top card first */
const FAN = [
  "",
  "-rotate-[5deg] -translate-x-[4%] translate-y-[1%]",
  "rotate-[6deg] translate-x-[5%] -translate-y-[2%]",
  "-rotate-[8deg] -translate-x-[5%] translate-y-[2%]",
  "rotate-[9deg] translate-x-[6%] -translate-y-[3%]",
];

/**
 * An archive folder drawn as a stack of up to five cards. Only the cover and
 * one more photo are real images; the cards behind them are lightweight
 * placeholders, so the stack still shows how full the folder is without
 * downloading extra photos. A folder with one image is a single photo.
 */
const PhotoStack = ({
  images,
  count,
  maxLayers = MAX_LAYERS,
  alt,
  className = "",
}: {
  /** Cover first */
  images: GalleryImage[];
  /** Total images in the folder; decides how many cards are drawn */
  count?: number;
  /** Most cards to draw (up to 5) */
  maxLayers?: number;
  alt: string;
  className?: string;
}) => {
  const real = images.slice(0, REAL_PHOTOS);

  const layers = Math.min(
    Math.min(maxLayers, MAX_LAYERS),
    Math.max(real.length, count ?? real.length)
  );

  // Depth 0 is the top card; draw the deepest first so the top lands last
  const depths = Array.from({ length: layers }, (_, i) => layers - 1 - i);

  return (
    <div className={`relative aspect-[4/3] ${className}`}>
      {layers === 0 ? (
        <div className="absolute inset-0 rounded-[18px] bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
          <Gallery size={36} color="var(--color-gray-400)" variant="Bulk" />
        </div>
      ) : (
        depths.map((depth) => {
          const image = real[depth];

          const isTop = depth === 0;

          return (
            <div
              key={image?._id || `card-${depth}`}
              aria-hidden={!isTop}
              className={`absolute inset-0 rounded-[18px] overflow-hidden border-4 border-white shadow-[0_12px_30px_-12px_rgb(0_0_0/0.45)] transition-transform duration-300 ${
                FAN[depth]
              } ${
                isTop ? "group-hover:-translate-y-1" : "group-hover:scale-[1.02]"
              } ${
                image
                  ? "bg-gray-200"
                  : "bg-gradient-to-br from-gray-200 to-gray-300"
              }`}
            >
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cldImage(image.url, { width: 640, height: 480 })}
                  alt={isTop ? alt : ""}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default PhotoStack;
