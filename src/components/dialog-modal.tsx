import React, { FunctionComponent, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const DialogModal: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}> = ({ open, setOpen, title, description, children }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(bool) => {
        setOpen(bool);
      }}
    >
      <DialogContent className="!max-w-[400px]">
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
