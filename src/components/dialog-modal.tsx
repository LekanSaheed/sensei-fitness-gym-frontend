import React, { FunctionComponent, ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { CloseCircle, Icon } from "iconsax-react";

const widths = {
  sm: "sm:!max-w-[420px]",
  md: "sm:!max-w-[520px]",
  lg: "sm:!max-w-[640px]",
};

/**
 * Shared modal frame: icon + title header, scrolling body and an optional
 * footer that stays visible (for the main action).
 */
const DialogModal: FunctionComponent<{
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  icon?: Icon;
  footer?: ReactNode;
  size?: keyof typeof widths;
}> = ({
  open,
  setOpen,
  title,
  description,
  children,
  icon,
  footer,
  size = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(bool) => {
        setOpen(bool);
      }}
    >
      <DialogContent
        showCloseButton={false}
        // Don't close when focus leaves the page (camera permission prompts,
        // password managers); clicking outside or Escape still closes it
        onFocusOutside={(e) => e.preventDefault()}
        className={`!max-w-[calc(100%-1.5rem)] ${widths[size]} p-0 gap-0 overflow-hidden rounded-[24px] border-gray-200 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.35)] flex flex-col max-h-[90vh]`}
      >
        <header className="relative flex items-start gap-3 px-6 pt-6 pb-5 border-b border-gray-100">
          {icon && (
            <span className="size-11 shrink-0 rounded-[14px] bg-default/10 inline-flex items-center justify-center">
              {React.createElement(icon, {
                size: 22,
                color: "var(--color-default)",
                variant: "Bulk",
              })}
            </span>
          )}
          <div className="min-w-0 flex-1 pr-8">
            {title ? (
              <DialogTitle className="text-[18px] font-bold tracking-tight leading-snug">
                {title}
              </DialogTitle>
            ) : (
              <DialogTitle className="sr-only">Dialog</DialogTitle>
            )}
            {description ? (
              <DialogDescription className="text-[13px] text-gray-500 mt-1">
                {description}
              </DialogDescription>
            ) : (
              <DialogDescription className="sr-only">Dialog</DialogDescription>
            )}
          </div>
          <DialogClose
            aria-label="Close"
            className="absolute top-5 right-5 size-8 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <CloseCircle size={20} color="currentColor" />
          </DialogClose>
        </header>

        <div className="modal-form flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <footer className="modal-form px-6 py-4 border-t border-gray-100 bg-gray-50/80">
            {footer}
          </footer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogModal;
