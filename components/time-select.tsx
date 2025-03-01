"use client";

import React from "react";
import { Button } from "./ui/button";
import { Step } from "@/types";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const TimeSelect = ({
  date,
  availableWeekDayTimes,
  availableWeekEndTimes,
  handleTime,
  setStep,
  reservationData,
  setReservationData,
}: {
  date: Date | undefined;
  availableWeekDayTimes: string[];
  availableWeekEndTimes: string[];
  handleTime: (time: string) => void;
  reservationData: {
    date: string;
    time: string;
    bandName: string;
    password: string;
  };
  setReservationData: React.Dispatch<
    React.SetStateAction<{
      date: string;
      time: string;
      bandName: string;
      password: string;
    }>
  >;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}) => {
  if (
    availableWeekDayTimes.length === 0 ||
    availableWeekEndTimes.length === 0
  ) {
    return (
      <p className="h-screen flex justify-center items-center text-2xl font-bold">
        読み込み中・・・
      </p>
    );
  }

  const yasumi = true;

  return (
    <div className="flex flex-col justify-center items-center gap-y-6">
      <div className="mt-2 flex flex-row gap-x-4 border border-blue-500 py-2 px-5">
        <p className="font-semibold text-sm text-blue-500">
          {reservationData.date}
        </p>
        <p
          className={cn(
            "font-semibold text-sm text-blue-500",
            !reservationData.time && "text-slate-500"
          )}
        >
          {reservationData.time ? reservationData.time : "時間選択"}
        </p>
      </div>
      <Button
        onClick={() => {
          setReservationData({ ...reservationData, time: "" });
          setStep("date");
        }}
        variant={"ghost"}
        className="absolute top-5 left-2 flex gap-x-2"
      >
        <ChevronLeft size={20} color="#3b82f6" />
        <span className="mb-[2px] text-blue-500">日付変更</span>
      </Button>

      {date && date.getDay() !== 0 && date.getDay() !== 6 && (
        <div className="grid grid-cols-2 gap-2 w-full">
          {yasumi
            ? availableWeekEndTimes.map((time, index) => (
                <Button
                  type="button"
                  onClick={() => {
                    if (reservationData.time === time) {
                      handleTime("");
                    } else {
                      handleTime(time);
                    }
                  }}
                  key={index}
                  variant={
                    reservationData.time === time ? "default" : "outline"
                  }
                >
                  {time}
                </Button>
              ))
            : availableWeekDayTimes.map((time, index) => (
                <Button
                  type="button"
                  onClick={() => {
                    if (reservationData.time === time) {
                      handleTime("");
                    } else {
                      handleTime(time);
                    }
                  }}
                  key={index}
                  variant={
                    reservationData.time === time ? "default" : "outline"
                  }
                >
                  {time}
                </Button>
              ))}
        </div>
      )}

      {date && (date.getDay() === 0 || date.getDay() === 6) && (
        <div className="grid grid-cols-2 gap-2 w-full">
          {availableWeekEndTimes.map((time, index) => (
            <Button
              type="button"
              onClick={() => {
                if (reservationData.time === time) {
                  handleTime("");
                } else {
                  handleTime(time);
                }
              }}
              key={index}
              variant={reservationData.time === time ? "default" : "outline"}
            >
              {time}
            </Button>
          ))}
        </div>
      )}

      <div className="border-b border-slate-300 w-full"></div>

      <Button
        type="button"
        className="w-full"
        disabled={!reservationData.time}
        onClick={() => {
          setStep("info");
        }}
      >
        次へ
      </Button>
    </div>
  );
};
