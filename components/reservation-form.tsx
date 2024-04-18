"use client";

import React, { useEffect, useState } from "react";
import { Step } from "@/types";
import { DateSelect } from "./date-select";
import { TimeSelect } from "./time-select";
import { dateFormatting } from "@/helper/date-formattong";
import { checkReservation, createReservation } from "@/services";
import { InfoForm } from "./info-form";

export const ReservationForm = ({
  mutate,
  setIsOpen,
}: {
  mutate: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState<Date>();
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    bandName: "",
    password: "",
  });
  const [availableWeekDayTimes, setAvailableWeekDayTimes] = useState<string[]>(
    []
  );
  const [availableWeekEndTimes, setAvailableWeekEndTimes] = useState<string[]>(
    []
  );

  useEffect(() => {
    setReservationData({ ...reservationData, date: dateFormatting(date) });
  }, [date]);

  const handleCheckReservation = async () => {
    try {
      const response = await checkReservation(reservationData.date);

      if (response) {
        setAvailableWeekDayTimes(response.availableTimes.availableWeekDayTimes);
        setAvailableWeekEndTimes(response.availableTimes.availableWeekEndTimes);
      } else {
        alert("서버 오류");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTime = (time: string) => {
    setReservationData({ ...reservationData, time });
  };

  const handleSubmit = async () => {
    try {
      const response = await createReservation(reservationData);

      if (response) {
        mutate();
        alert("予約を登録しました");
        setIsOpen(false);
      } else {
        alert("SERVER ERROR");
      }
    } catch (error) {
      console.log(error);
      alert("SERVER ERROR");
    }
  };

  return (
    <div className="mt-6 px-4">
      {step === "date" && (
        <DateSelect
          date={date}
          setDate={setDate}
          reservationData={reservationData}
          handleCheckReservation={handleCheckReservation}
          setStep={setStep}
        />
      )}
      {step === "time" && (
        <TimeSelect
          date={date}
          availableWeekDayTimes={availableWeekDayTimes}
          availableWeekEndTimes={availableWeekEndTimes}
          reservationData={reservationData}
          setReservationData={setReservationData}
          handleTime={handleTime}
          setStep={setStep}
        />
      )}
      {step === "info" && (
        <InfoForm
          reservationData={reservationData}
          setReservationData={setReservationData}
          handleSubmit={handleSubmit}
          setStep={setStep}
        />
      )}
    </div>
  );
};
