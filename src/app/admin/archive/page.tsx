"use client";

import Button from "@/components/button";
import FolderCard from "@/components/content/FolderCard";
import NewFolderModal from "@/components/content/NewFolderModal";
import SectionLoader from "@/components/SectionLoader";
import { useGetArchiveEventsQuery } from "@/redux/api-slices/content.slice";
import { FolderAdd } from "iconsax-react";
import React, { useState } from "react";

const ArchivePage = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetArchiveEventsQuery(null);

  const events = data?.data || [];

  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-[13px] text-gray-500 max-w-[560px]">
          Each folder is a past event and can hold subfolders (for example, one
          per day). Published folders with images appear on the website as a
          stack of photos.
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
              <FolderCard event={event} />
            </li>
          ))}
        </ul>
      )}

      <NewFolderModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default ArchivePage;
