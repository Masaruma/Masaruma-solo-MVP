import { ReactNode } from "react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import {
  CustomDialogContent,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog.tsx";

export const DialogCustom = ({ children, dialogTitle, isOpen }: {
  children?: ReactNode;
  dialogTitle: string
  isOpen: boolean;
}) => {
  return (
    <Dialog open={isOpen} >
      <CustomDialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            homeに戻るかリスタートしてください
          </DialogDescription>
        </DialogHeader>
        <div className={"grid gap-4 py-4"}>
          <div className={"grid grid-cols-4 items-center gap-4"}>
            {children}
          </div>
        </div>
        <DialogFooter>
          <Button type={"button"}><Link to={"/"}>HOMEへ</Link></Button>
        </DialogFooter>
      </CustomDialogContent>
    </Dialog>
  );
};
