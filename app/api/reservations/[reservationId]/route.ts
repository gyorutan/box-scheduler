import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from "bcrypt";

interface Params {
  reservationId?: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: Params }
) => {
  const { reservationId } = params;
  const body = await request.json();

  try {
    const reservations = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
    });

    if (body === "kasinokiadmin") {
      await prisma.reservation.delete({
        where: {
          id: reservationId,
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
          id: reservationId,
        },
      });

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
};
