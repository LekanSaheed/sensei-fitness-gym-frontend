import { UpdatePassword } from "@/app/dashboard/profile/page";
import FormCard from "@/components/FormCard";
import React from "react";

const SecurityPage = () => {
  return (
    <FormCard
      title="Change password"
      description="Use a strong password you don't use anywhere else."
      className="max-w-[520px]"
    >
      <UpdatePassword />
    </FormCard>
  );
};

export default SecurityPage;
