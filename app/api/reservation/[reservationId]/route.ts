import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import bcrypt from "bcrypt";

interface Params {
  reservationId?: number;
}

export const DELETE = async (
  request: Request,
  { params }: { params: Params }
) => {
  const { reservationId } = params;
  const body = await request.json();

  console.log(body);

  try {
    const reservations = await prisma.reservation.findUnique({
      where: {
        id: Number(reservationId),
      },
    });

    console.log(reservations);

    if (body === "kasinokiadmin") {
      await prisma.reservation.delete({
        where: {
          id: Number(reservationId),
        },
      });

      return NextResponse.json({ success: true });
    }

    if (reservations) {
      const comparePassword = await bcrypt.compare(body, reservations.password);

      if (!comparePassword) {
        return NextResponse.json({ success: false });
      }

      await prisma.reservation.delete({
        where: {
          id: Number(reservationId),
        },
      });

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
};
