import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-4 overflow-y-auto pb-4">{children}</div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
};

export default SheetModal;
