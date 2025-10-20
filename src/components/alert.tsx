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
import { Button } from "@/components/ui/button";
import { FunctionComponent, ReactNode } from "react";

const Alert: FunctionComponent<{
  open?: boolean;
  setOpen?: (bool: boolean) => void;
  title: string;
  description?: string;
  alertTrigger?: ReactNode;
  loading?: boolean;
  onContinueClick?: VoidFunction;
}> = ({
  open,
  setOpen,
  title,
  description,
  alertTrigger,
  loading,
  onContinueClick,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {alertTrigger && (
        <AlertDialogTrigger asChild>{alertTrigger}</AlertDialogTrigger>
      )}
      <AlertDialogContent className="!max-w-[460px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinueClick} disabled={loading}>
            {loading ? "Please wait" : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
