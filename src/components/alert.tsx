import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InfoCircle } from "iconsax-react";
import { FunctionComponent, ReactNode } from "react";

const Alert: FunctionComponent<{
  open?: boolean;
  setOpen?: (bool: boolean) => void;
  title: string;
  description?: string;
  alertTrigger?: ReactNode;
  loading?: boolean;
  onContinueClick?: VoidFunction;
  /** Extra content between the description and the buttons */
  children?: ReactNode;
  /** Text on the confirm button */
  continueLabel?: string;
}> = ({
  open,
  setOpen,
  title,
  description,
  alertTrigger,
  loading,
  onContinueClick,
  children,
  continueLabel = "Continue",
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {alertTrigger && (
        <AlertDialogTrigger asChild>{alertTrigger}</AlertDialogTrigger>
      )}
      <AlertDialogContent className="!max-w-[calc(100%-1.5rem)] sm:!max-w-[420px] rounded-[24px] p-6 gap-5 border-gray-200 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.35)]">
        <AlertDialogHeader className="items-center text-center sm:items-center sm:text-center gap-2">
          <span className="size-12 rounded-full bg-default/10 inline-flex items-center justify-center mb-1">
            <InfoCircle size={24} color="var(--color-default)" variant="Bulk" />
          </span>
          <AlertDialogTitle className="text-[18px] font-bold tracking-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-gray-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter className="grid grid-cols-2 gap-2 sm:flex-none">
          <AlertDialogCancel className="rounded-full h-11 border-gray-200">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onContinueClick}
            disabled={loading}
            className="rounded-full h-11 bg-default hover:bg-default/90 text-white"
          >
            {loading ? "Please wait" : continueLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
