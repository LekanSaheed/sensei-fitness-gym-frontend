import { InfoCircle } from "iconsax-react";
import React, { FunctionComponent, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from "./button";
import Image from "next/image";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Image as Img } from "iconsax-react";
import toast from "react-hot-toast";

const Cropper: FunctionComponent<{
  onComplete: (file: File | null) => void;
  loading: boolean;
}> = ({ onComplete, loading }) => {
  const [imgSrc, setImgSrc] = useState("");

  const [selectedFile, setFile] = useState<File | null>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e?.target?.files?.[0];

    const MAX_FILE_SIZE = 5000000;

    if (!file) return toast.error("No image selected");

    if (file.size > MAX_FILE_SIZE)
      return toast.error(
        "Maximum image size is 5mb. Selected image is greater than 5mb, please compress image to 5mb or below or select another image"
      );

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");

        setFile(file);
      });

      reader.readAsDataURL(e.target.files[0]);
    }
  }
  return (
    <>
      {imgSrc ? (
        <div>
          {/* <div className="flex gap-2 mb-4">
        <InfoCircle size={16} color="var(--color-default)" />
        <p className="text-gray-500 dark:text-gray-400 text-[14px] ">
          Please slide your finger/mouse across the image to crop it
        </p>
      </div> */}

          <div className="size-[150px] rounded-full overflow-hidden mx-auto relative">
            <Image alt="preview" src={imgSrc} className="object-cover" fill />
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              fullWidth
              label="Cancel"
              onClick={() => {
                setImgSrc("");
              }}
              variant="outlined"
              color="gray"
              disabled={loading}
            />
            <Button
              fullWidth
              label="Proceed"
              loading={loading}
              onClick={() => onComplete(selectedFile)}
            />
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            className="absolute opacity-0 inset-0"
            onChange={onSelectFile}
          />
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <Img color="var(--color-secondary-foreground)" />
              </EmptyMedia>
              <EmptyTitle className="dark:text-white">
                Click to upload
              </EmptyTitle>
              <EmptyDescription>
                Only images allowed. Max file size 5mb
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </>
  );
};

export default Cropper;
