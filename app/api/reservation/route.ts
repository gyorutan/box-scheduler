import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

export const GET = async (request: Request) => {
  const reservations = await prisma.reservation.findMany({
    orderBy: {
      time: "asc",
    },
  });

  return NextResponse.json(reservations);
};

export const POST = async (request: Request) => {
  const body = await request.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const createdReservation = await prisma.reservation.create({
    data: {
      writer: body.writer,
      password: hashedPassword,
      date: body.date,
      time: body.time,
    },
  });

  console.log(createdReservation);

  return NextResponse.json({ success: true, createdReservation });
};
