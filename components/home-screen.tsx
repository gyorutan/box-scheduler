"use client";

import React from "react";
import { BottomSheet } from "@/components/bottom-sheet";
import { Reservations } from "@/components/reservations";
import { useReservation } from "@/hooks/useReservation";

const HomeScreen = () => {
  const { data, isLoading, mutate } = useReservation();

  if (isLoading) {
    return (
      <p className="h-screen flex justify-center items-center text-2xl font-bold">
        読み込み中・・・
      </p>
    );
  }

  return (
    <>
      <BottomSheet mutate={mutate} />
      {data && <Reservations data={data} mutate={mutate} />}
    </>
  );
};

export default HomeScreen;
