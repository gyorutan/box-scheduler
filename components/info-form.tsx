"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { Step } from "@/types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const InfoForm = ({
  reservationData,
  setReservationData,
  handleSubmit,
  setStep,
}: {
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
  handleSubmit: () => Promise<void>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
}) => {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex flex-col justify-center items-center gap-y-6">
      <div className="flex mt-2 flex-row gap-x-4 border border-blue-500 py-2 px-5">
        <p className="font-semibold text-sm text-blue-500">
          {reservationData.date}
        </p>
        <p className="font-semibold text-sm text-blue-500">
          {reservationData.time}
        </p>
      </div>
      <Button
        onClick={() => {
          setStep("time");
        }}
        variant={"ghost"}
        className="absolute top-5 left-2 flex gap-x-2"
      >
        <ChevronLeft size={20} color="#3b82f6" />
        <span className="mb-[2px] text-blue-500">時間変更</span>
      </Button>
      <div className="w-full flex flex-col gap-y-4">
        <Input
          className="font-semibold placeholder:font-normal"
          type="text"
          placeholder="バンド名"
          value={reservationData.bandName}
          onChange={(e) => {
            setReservationData({
              ...reservationData,
              bandName: e.target.value,
            });
          }}
        />
        <Input
          className="font-semibold placeholder:font-normal"
          type={checked ? "password" : "text"}
          placeholder="パスワード"
          value={reservationData.password}
          onChange={(e) => {
            setReservationData({
              ...reservationData,
              password: e.target.value,
            });
          }}
        />
        <div className="flex items-center gap-x-2">
          <input
            className="ml-1"
            id="password-visible"
            type="checkbox"
            onChange={() => {
              setChecked((checked) => !checked);
            }}
          />
          <Label className="text-xs mb-[2px]" htmlFor="password-visible">
            パスワード表示
          </Label>
        </div>
      </div>

      <div className="border-b border-slate-300 w-full"></div>

      <Button
        disabled={!reservationData.bandName || !reservationData.password}
        onClick={handleSubmit}
        className="w-full"
      >
        予約
      </Button>
    </div>
  );
};
