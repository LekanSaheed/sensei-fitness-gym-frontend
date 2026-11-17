"use client";

import Input from "@/components/input";
import TextArea from "@/components/textarea";
import { Switch } from "@/components/ui/switch";
import { ArchiveEventInput } from "@/redux/api-slices/content.slice";
import React from "react";

/** Title, date, description and published switch for an archive folder */
const ArchiveEventForm = ({
  value,
  onChange,
}: {
  value: ArchiveEventInput;
  onChange: (next: ArchiveEventInput) => void;
}) => (
  <div>
    <Input
      label="Event name"
      placeholder="e.g. Summer Bootcamp 2026"
      value={value.title}
      maxLength={120}
      required
      onChange={(e) => onChange({ ...value, title: e.target.value })}
    />
    <Input
      label="Event date"
      type="date"
      value={value.eventDate}
      required
      onChange={(e) => onChange({ ...value, eventDate: e.target.value })}
    />
    <TextArea
      label="Description (optional)"
      placeholder="A short note shown on the website"
      rows={3}
      maxLength={2000}
      value={value.description}
      onChange={(e) => onChange({ ...value, description: e.target.value })}
    />
    <label className="flex items-center justify-between gap-4 rounded-[14px] border border-gray-200 p-3.5 cursor-pointer">
      <span>
        <span className="block text-[13px] font-semibold">
          Show on the website
        </span>
        <span className="block text-[12px] text-gray-500">
          Published folders with at least one image appear in the archive on
          the landing page.
        </span>
      </span>
      <Switch
        checked={value.isPublished}
        onCheckedChange={(checked) =>
          onChange({ ...value, isPublished: checked })
        }
        aria-label="Show on the website"
      />
    </label>
  </div>
);

export default ArchiveEventForm;
