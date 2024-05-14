import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const guest = await prisma.guests.findUniqueOrThrow({
      where: {
        guestId: Number(id),
      },
    });
    return NextResponse.json(guest);
  } catch (error) {
    console.error("Error read Guest:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deletedHomeowner = await prisma.guests.delete({
      where: { guestId: Number(id) },
    });
    return NextResponse.json(deletedHomeowner);
  } catch (error) {
    console.error("Error delete Guest:", error);
  } finally {
    await prisma.$disconnect();
  }
}
