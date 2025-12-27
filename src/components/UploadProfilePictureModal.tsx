import React, { FunctionComponent, useState } from "react";
import Modal from "./Modal";
import useUser from "@/hooks/useUser";
import Cropper from "./Cropper";
import { useUpdateProfilePictureMutation } from "@/redux/api-slices/user.slice";
import { isFetchBaseQueryError } from "@/utils";
import { ErrorResponse } from "@/types";
import toast from "react-hot-toast";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { useFetchUserAndLogin } from "@/hooks/useLogin";

const UploadProfilePictureModal: FunctionComponent<{
  open?: boolean;
  setOpen?: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  const user = useUser();

  const openModal = open || !user.profile_picture;

  const [updateDp, updateStatus] = useUpdateProfilePictureMutation();

  const { fetchUserAndLogin } = useFetchUserAndLogin();

  const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.set("image", file);

    const res = await updateDp(formData);

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error?.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success("Successfully updated profile picture");

        fetchUserAndLogin();

        if (!!setOpen) {
          setOpen(false);
        }
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  return (
    <Modal
      title={
        user?.profile_picture
          ? "Update your profile picture"
          : "Set your profile picture"
      }
      bottomSheet={false}
      open={openModal}
      hideCloseBtn={!user.profile_picture}
      setOpen={setOpen}
    >
      <Cropper
        loading={updateStatus.isLoading}
        onComplete={(file) => {
          uploadImage(file!);
        }}
      />
    </Modal>
  );
};

export default UploadProfilePictureModal;
