"use client";

import Button from "@/components/button";
import ArchiveEventForm from "@/components/content/ArchiveEventForm";
import DialogModal from "@/components/dialog-modal";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { ADMIN_ARCHIVE } from "@/constants/routes";
import {
  ArchiveEventInput,
  useCreateArchiveEventMutation,
} from "@/redux/api-slices/content.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import { FolderAdd } from "iconsax-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const emptyForm = (): ArchiveEventInput => ({
  title: "",
  description: "",
  eventDate: moment().format("YYYY-MM-DD"),
  isPublished: false,
});

/** Create a folder, or a subfolder when `parent` is given */
const NewFolderModal = ({
  open,
  setOpen,
  parent,
  parentTitle,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  parent?: string | null;
  parentTitle?: string;
}) => {
  const [form, setForm] = useState<ArchiveEventInput>(emptyForm);

  const [create, createStatus] = useCreateArchiveEventMutation();

  const router = useRouter();

  useEffect(() => {
    if (!open) setForm(emptyForm());
  }, [open]);

  const submit = async () => {
    const res = await create({
      ...form,
      title: form.title.trim(),
      parent: parent || null,
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      toast.error(
        (res.error.data as ErrorResponse)?.error || DEFAULT_ERROR_MESSAGE
      );
    } else if (res.data?.success && res.data.data) {
      toast.success(
        `${parent ? "Subfolder" : "Folder"} created. Now add some images.`
      );

      setOpen(false);

      router.push(`${ADMIN_ARCHIVE}/${res.data.data._id}`);
    } else {
      toast.error(res.data?.error || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <DialogModal
      open={open}
      setOpen={setOpen}
      title={parent ? "New subfolder" : "New archive folder"}
      description={
        parent
          ? `Inside "${parentTitle || "this folder"}"`
          : "One folder per past event"
      }
      icon={FolderAdd}
      footer={
        <Button
          label={parent ? "Create subfolder" : "Create folder"}
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
  );
};

export default NewFolderModal;
