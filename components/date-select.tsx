"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { threeWeeksLater } from "@/helper/three-weeks-later";
import { Button } from "./ui/button";
import { Step } from "@/types";

export const DateSelect = ({
  date,
  setDate,
  reservationData,
  handleCheckReservation,
  setStep,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  reservationData: {
    date: string;
    time: string;
    bandName: string;
    password: string;
  };
  handleCheckReservation: () => Promise<void>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex mt-2 flex-col gap-y-6 w-full items-center">
        <p
          className={cn(
            "border border-blue-500 text-blue-500 py-2 px-5 font-semibold flex justify-center",
            !date && "text-slate-500 border-slate-300"
          )}
        >
          {date ? reservationData.date : "日付を選択してください"}
        </p>
        <Calendar
          className="border rounded-md"
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(date: Date) =>
            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
            date > new Date(threeWeeksLater)
          }
        />

        <div className="border-b border-slate-300 w-full"></div>
        <Button
          type="button"
          className="w-full"
          disabled={!!!date}
          onClick={() => {
            handleCheckReservation();
            setStep("time");
          }}
        >
          次へ
        </Button>
      </div>
    </div>
  );
};
