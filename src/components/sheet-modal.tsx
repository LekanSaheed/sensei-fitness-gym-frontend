import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FunctionComponent, ReactNode } from "react";

const SheetModal: FunctionComponent<{
  title: string;
  description: string;
  children: ReactNode;
  trigger?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  setOpen?: (bool: boolean) => void;
}> = ({ children, description, title, trigger, footer, open, setOpen }) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:!max-w-[460px] gap-0 p-0 border-l-0 shadow-[0_0_60px_-10px_rgb(0_0_0/0.35)] sm:rounded-l-[24px] overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-gray-100 gap-1">
          <span className="h-1 w-10 rounded-full bg-default mb-2" />
          <SheetTitle className="text-[18px] font-bold tracking-tight">
            {title}
          </SheetTitle>
          <SheetDescription className="text-[13px] text-gray-500">
            {description}
          </SheetDescription>
        </SheetHeader>
        <div className="modal-form flex-1 px-6 py-5 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <SheetFooter className="modal-form px-6 py-4 border-t border-gray-100 bg-gray-50/80">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SheetModal;
