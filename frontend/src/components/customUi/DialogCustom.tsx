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

// reloadPage関数をexport
const reloadPage = () => window.location.reload();

export const DialogCustom = ({
  children,
  dialogTitle,
  isOpen,
}: {
  children?: ReactNode;
  dialogTitle: string;
  isOpen: boolean;
}) => {
  const handleRetry = () => {
    reloadPage();
  };

  return (
    <Dialog open={isOpen}>
      <CustomDialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogTitle === "GAME OVER" &&
              "残念でした。リトライしてみましょう。"}
            {dialogTitle === "GAME CLEAR" && "おめでとうございます！"}
          </DialogDescription>
        </DialogHeader>
        <div className={"grid gap-4 py-4"}>
          <div className={"grid grid-cols-4 items-center gap-4"} />
          {children}
        </div>
        <DialogFooter>
          <Button onClick={handleRetry} variant={"default"}>
            リトライ
          </Button>
          <Button type={"button"}>
            <Link to={"/"}>HOMEへ</Link>
          </Button>
        </DialogFooter>
      </CustomDialogContent>
    </Dialog>
  );
};
