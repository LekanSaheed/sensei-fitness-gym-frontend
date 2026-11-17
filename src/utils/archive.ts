import { ResponseType } from "@/types";
import { ArchiveEventSummary, PublicArchiveEvent } from "@/types/Content";

/** How long the website caches archive data before refetching (seconds) */
const REVALIDATE = 60;

/** Published archive folders for the website (server side) */
export const fetchPublicArchive = async (
  limit?: number
): Promise<{ total: number; events: ArchiveEventSummary[] }> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/archive${limit ? `?limit=${limit}` : ""}`,
      { next: { revalidate: REVALIDATE, tags: ["archive"] } }
    );

    const data: ResponseType<{ total: number; events: ArchiveEventSummary[] }> =
      await res.json();

    return {
      total: data?.data?.total || 0,
      events: data?.data?.events || [],
    };
  } catch {
    return { total: 0, events: [] };
  }
};

/** One published archive folder by slug, or null when not found */
export const fetchPublicArchiveEvent = async (
  slug: string
): Promise<PublicArchiveEvent | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/archive/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE, tags: ["archive"] } }
    );

    if (!res.ok) return null;

    const data: ResponseType<PublicArchiveEvent> = await res.json();

    return data?.data || null;
  } catch {
    return null;
  }
};
