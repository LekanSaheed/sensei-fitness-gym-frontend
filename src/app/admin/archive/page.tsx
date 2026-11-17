"use client";

import Button from "@/components/button";
import ArchiveEventForm from "@/components/content/ArchiveEventForm";
import PhotoStack from "@/components/content/PhotoStack";
import DialogModal from "@/components/dialog-modal";
import SectionLoader from "@/components/SectionLoader";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { ADMIN_ARCHIVE } from "@/constants/routes";
import {
  ArchiveEventInput,
  useCreateArchiveEventMutation,
  useGetArchiveEventsQuery,
} from "@/redux/api-slices/content.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { FolderAdd } from "iconsax-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const emptyForm = (): ArchiveEventInput => ({
  title: "",
  description: "",
  eventDate: moment().format("YYYY-MM-DD"),
  isPublished: false,
});

const ArchivePage = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetArchiveEventsQuery(null);

  const events = data?.data || [];

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<ArchiveEventInput>(emptyForm);

  const [create, createStatus] = useCreateArchiveEventMutation();

  const router = useRouter();

  const submit = async () => {
    const res = await create({ ...form, title: form.title.trim() });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      toast.error(
        (res.error.data as ErrorResponse)?.error || DEFAULT_ERROR_MESSAGE
      );
    } else if (res.data?.success && res.data.data) {
      toast.success("Folder created. Now add some images.");

      setOpen(false);

      setForm(emptyForm());

      router.push(`${ADMIN_ARCHIVE}/${res.data.data._id}`);
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-[13px] text-gray-500 max-w-[560px]">
          Each folder is a past event. Published folders with images appear on
          the website as a stack of photos.
        </p>
        <Button
          label="New folder"
          icon={FolderAdd}
          fullRadius
          permissions={["manage_archive"]}
          onClick={() => setOpen(true)}
        />
      </div>

      <SectionLoader
        loading={isLoading || (isFetching && !events.length)}
        error={isError}
        refetch={refetch}
      />

      {!isLoading && !isError && events.length === 0 && (
        <div className="rounded-[18px] bg-white border border-gray-200/80 p-10 text-center">
          <span className="size-14 rounded-full bg-default/10 inline-flex items-center justify-center mb-3">
            <FolderAdd size={26} color="var(--color-default)" variant="Bulk" />
          </span>
          <p className="font-semibold">No archive folders yet</p>
          <p className="text-[13px] text-gray-500 mt-1">
            Create a folder for a past event, then add its photos.
          </p>
        </div>
      )}

      {events.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
          {events.map((event) => (
            <li key={event._id}>
              <Link
                href={`${ADMIN_ARCHIVE}/${event._id}`}
                className="group block rounded-[22px] bg-white border border-gray-200/80 p-4 pt-6 transition hover:border-default/40 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.25)]"
              >
                <PhotoStack
                  images={event.preview}
                  count={event.imageCount}
                  alt={event.title}
                  className="mx-3"
                />
                <div className="mt-6 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-[15px] truncate">
                      {event.title}
                    </p>
                    <p className="text-[12px] text-gray-500">
                      {moment(event.eventDate).format("ll")} ·{" "}
                      {event.imageCount} image
                      {event.imageCount === 1 ? "" : "s"}
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
            </li>
          ))}
        </ul>
      )}

      <DialogModal
        open={open}
        setOpen={setOpen}
        title="New archive folder"
        description="One folder per past event"
        icon={FolderAdd}
        footer={
          <Button
            label="Create folder"
            fullWidth
            fullRadius
            size="lg"
            loading={createStatus.isLoading}
            disabled={form.title.trim().length < 2 || !form.eventDate}
            onClick={submit}
          />
        }
      >
        <ArchiveEventForm value={form} onChange={setForm} />
      </DialogModal>
    </div>
  );
};

export default ArchivePage;
