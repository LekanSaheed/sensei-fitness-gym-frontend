/**
 * Cloudinary delivery URL resized on the fly (and served as WebP/AVIF where
 * supported). Non-Cloudinary URLs are returned unchanged.
 */
export const cldImage = (
  url: string | undefined | null,
  {
    width,
    height,
    crop = "fill",
  }: { width: number; height?: number; crop?: "fill" | "limit" }
) => {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const t = [
    `c_${crop}`,
    `w_${width}`,
    height ? `h_${height}` : "",
    "q_auto",
    "f_auto",
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${t}/`);
};

const MAX_DIMENSION = 2400;

const MAX_BYTES = 4.5 * 1024 * 1024;

/**
 * Shrinks big photos in the browser before upload (the server accepts 5MB per
 * image). Small images are sent unchanged.
 */
export const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);

  if (!bitmap) return file;

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  );

  if (scale === 1 && file.size <= MAX_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");

  canvas.width = Math.round(bitmap.width * scale);

  canvas.height = Math.round(bitmap.height * scale);

  canvas
    .getContext("2d")
    ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  bitmap.close();

  for (const quality of [0.86, 0.75, 0.6]) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

    if (blob && blob.size <= MAX_BYTES) {
      return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
        type: "image/jpeg",
      });
    }
  }

  return file;
};
