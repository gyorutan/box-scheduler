"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ReservationForm } from "./reservation-form";

export const BottomSheet = ({ mutate }: { mutate: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="w-full p-4 border-b border-slate-300">
          <Button className="w-full p-4" variant={"blue"}>予約作成</Button>
        </div>
      </SheetTrigger>
      <SheetContent
        side={"bottom"}
        className="h-[90%] min-w-[375px] max-w-[768px] m-auto rounded-t-2xl"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-center">
            予約作成
          </SheetTitle>
        </SheetHeader>
        <ReservationForm setIsOpen={setIsOpen} mutate={mutate} />
      </SheetContent>
    </Sheet>
  );
};
