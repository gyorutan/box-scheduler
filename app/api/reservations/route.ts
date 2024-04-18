import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

export const GET = async (request: Request) => {
  const reservations = await prisma.reservation.findMany({
    orderBy: {
      time: "asc",
    },
  });

  console.log({ reservations });

  return NextResponse.json({ reservations });
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const { date, time, bandName, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdReservation = await prisma.reservation.create({
      data: {
        bandName,
        password: hashedPassword,
        date,
        time,
      },
    });

    return NextResponse.json({
      success: true,
      message: "予約しました",
      createdReservation,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server Error" });
  }
};
