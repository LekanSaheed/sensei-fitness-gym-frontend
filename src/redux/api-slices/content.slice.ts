import { PaginatedResponse, ResponseType } from "@/types";
import {
  ArchiveEvent,
  ArchiveEventSummary,
  GalleryImage,
  PublicArchiveEvent,
} from "@/types/Content";
import { api } from "../api";

export interface ArchiveEventInput {
  title: string;
  description: string;
  eventDate: string;
  isPublished: boolean;
}

const contentApi = api.injectEndpoints({
  endpoints(build) {
    return {
      /* ----------------------------- gallery ----------------------------- */
      getGallery: build.query<
        PaginatedResponse<GalleryImage[]>,
        { page: number; limit?: number }
      >({
        query: ({ page, limit = 24 }) =>
          `/admin/gallery?page=${page}&limit=${limit}`,
        providesTags: ["gallery"],
      }),
      uploadGalleryImages: build.mutation<
        ResponseType<{
          uploaded: { _id: string; url: string }[];
          failed: number;
        }>,
        FormData
      >({
        query: (body) => ({ url: "/admin/gallery", method: "post", body }),
        invalidatesTags: ["gallery", "archive"],
      }),
      updateGalleryCaption: build.mutation<
        ResponseType<GalleryImage>,
        { id: string; caption: string }
      >({
        query: ({ id, caption }) => ({
          url: `/admin/gallery/${id}`,
          method: "put",
          body: { caption },
        }),
        invalidatesTags: ["gallery", "archive"],
      }),
      deleteGalleryImage: build.mutation<ResponseType, string>({
        query: (id) => ({ url: `/admin/gallery/${id}`, method: "delete" }),
        invalidatesTags: ["gallery", "archive"],
      }),

      /* ----------------------------- archive ----------------------------- */
      getArchiveEvents: build.query<
        ResponseType<ArchiveEventSummary[]>,
        null
      >({
        query: () => "/admin/archive",
        providesTags: ["archive"],
      }),
      getArchiveEvent: build.query<ResponseType<ArchiveEvent>, string>({
        query: (id) => `/admin/archive/${id}`,
        providesTags: ["archive"],
      }),
      createArchiveEvent: build.mutation<
        ResponseType<ArchiveEvent>,
        ArchiveEventInput
      >({
        query: (body) => ({ url: "/admin/archive", method: "post", body }),
        invalidatesTags: ["archive"],
      }),
      updateArchiveEvent: build.mutation<
        ResponseType<ArchiveEvent>,
        { id: string } & Partial<ArchiveEventInput>
      >({
        query: ({ id, ...body }) => ({
          url: `/admin/archive/${id}`,
          method: "put",
          body,
        }),
        invalidatesTags: ["archive"],
      }),
      deleteArchiveEvent: build.mutation<ResponseType, string>({
        query: (id) => ({ url: `/admin/archive/${id}`, method: "delete" }),
        invalidatesTags: ["archive", "gallery"],
      }),
      addArchiveImages: build.mutation<
        ResponseType,
        { id: string; imageIds: string[] }
      >({
        query: ({ id, imageIds }) => ({
          url: `/admin/archive/${id}/images`,
          method: "post",
          body: { imageIds },
        }),
        invalidatesTags: ["archive", "gallery"],
      }),
      removeArchiveImage: build.mutation<
        ResponseType,
        { id: string; imageId: string }
      >({
        query: ({ id, imageId }) => ({
          url: `/admin/archive/${id}/images/${imageId}`,
          method: "delete",
        }),
        invalidatesTags: ["archive", "gallery"],
      }),
      setArchiveCover: build.mutation<
        ResponseType,
        { id: string; imageId: string }
      >({
        query: ({ id, imageId }) => ({
          url: `/admin/archive/${id}/cover`,
          method: "put",
          body: { imageId },
        }),
        invalidatesTags: ["archive"],
      }),

      /* ----------------------------- public ------------------------------ */
      getPublicArchiveEvent: build.query<
        ResponseType<PublicArchiveEvent>,
        string
      >({
        query: (slug) => `/archive/${encodeURIComponent(slug)}`,
      }),
    };
  },
});

export const {
  useGetGalleryQuery,
  useUploadGalleryImagesMutation,
  useUpdateGalleryCaptionMutation,
  useDeleteGalleryImageMutation,
  useGetArchiveEventsQuery,
  useGetArchiveEventQuery,
  useCreateArchiveEventMutation,
  useUpdateArchiveEventMutation,
  useDeleteArchiveEventMutation,
  useAddArchiveImagesMutation,
  useRemoveArchiveImageMutation,
  useSetArchiveCoverMutation,
  useGetPublicArchiveEventQuery,
} = contentApi;
