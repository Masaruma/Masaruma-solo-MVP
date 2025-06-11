import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button.tsx";

export const MultiButtons = ({
  className,
  mapObject,
  nameArray,
  onClickHandlers,
  setState,
  state,
}: {
  className?: string;
  mapObject?: Record<any, number>;
  nameArray: string[] | number[];
  onClickHandlers: () => void;
  setState: Dispatch<SetStateAction<any>>;
  state: any;
}) => (
  <div className={"flex flex-col items-center gap-4"}>
    <div className={className ?? "flex gap-4"}>
      {nameArray.map((name) => {
        return (
          <Button
            key={name}
            onClick={() => {
              onClickHandlers();
              mapObject ? setState(mapObject[name]) : setState(name);
            }}
            variant={
              state === (mapObject ? mapObject[name] : name)
                ? "default"
                : "secondary"
            }
          >
            {name}
          </Button>
        );
      })}
    </div>
  </div>
);
