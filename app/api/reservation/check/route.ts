import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { weekDayTimes, weekEndTimes } from "@/libs/timeData";

export const POST = async (request: Request) => {
  const body = await request.json();
  console.log(body);

  const checkedDate = await prisma.reservation.findMany({
    where: {
      date: body,
    },
  });

  interface ReservedTimesType {
    time: string[];
  }

  const reservedTimes: ReservedTimesType = {
    time: [],
  };

  checkedDate.forEach((item) => {
    reservedTimes.time.push(item.time!);
  });

  // 예약된 시간
  const reservedTime = reservedTimes.time;

  // 평일 예약된 시간 제외
  const availableWeekDayTimes = weekDayTimes.filter(
    (time: string) => !reservedTime.includes(time)
  );

  // 주말 예약된 시간 제외
  const availableWeekEndTimes = weekEndTimes.filter(
    (time: string) => !reservedTime.includes(time)
  );

  const availableTimes = { availableWeekDayTimes, availableWeekEndTimes };

  return NextResponse.json({ success: true, availableTimes });
};
