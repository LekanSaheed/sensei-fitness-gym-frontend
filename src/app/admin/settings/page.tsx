import { UpdateProfile } from "@/app/dashboard/profile/page";
import FormCard from "@/components/FormCard";
import React from "react";

const ProfileSettings = () => {
  return (
    <FormCard
      title="Profile details"
      description="Update the name and username on your admin account."
      className="max-w-[520px]"
    >
      <UpdateProfile />
    </FormCard>
  );
};

export default ProfileSettings;
