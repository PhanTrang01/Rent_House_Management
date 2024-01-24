import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const allRents = await prisma.homeContracts.findMany();
    //   console.dir(allUsers, { depth: null });
    return NextResponse.json(allRents);
  } catch (error) {
    console.error("Error find Home Contract:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const { homeId, guestId, cycle, rental, duration } = await req.json();

    const Rent = await prisma.homeContracts.create({
      data: {
        homeId: Number(homeId),
        guestId: Number(guestId),
        dateRent: new Date(),
        cyclePayment: Number(cycle),
        rental: Number(rental),
        duration: Number(duration),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(Rent);
  } catch (error) {
    console.error("Error create Home Contract:", error);
  } finally {
    await prisma.$disconnect();
    // return NextResponse.json({ message: "Operation completed successfully" });
  }
}
