import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { weekDayTimes, weekEndTimes } from "@/helper/times";
import { ReservedTimesType } from "@/types";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const checkedDate = await prisma.reservation.findMany({
      where: {
        date: body,
      },
    });

    const reservedTimes: ReservedTimesType = {
      time: [],
    };

    checkedDate.forEach((item) => {
      reservedTimes.time.push(item.time);
    });

    const reservedTime = reservedTimes.time;

    const availableWeekDayTimes = weekDayTimes.filter(
      (time: string) => !reservedTime.includes(time)
    );

    const availableWeekEndTimes = weekEndTimes.filter(
      (time: string) => !reservedTime.includes(time)
    );

    const availableTimes = { availableWeekDayTimes, availableWeekEndTimes };

    return NextResponse.json({ success: true, availableTimes });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server Error" });
  }
};
