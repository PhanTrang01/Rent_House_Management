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
    const homeContract = await prisma.homeContract.findUniqueOrThrow({
      where: {
        homeContractsId: Number(id),
      },
      include: {
        guest: true,
        home: {
          include: {
            homeowner: true,
          },
        },
      },
    });

    return NextResponse.json(homeContract);
  } catch (error) {
    console.error("Error find HomeContract:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await _req.json(); // Đọc dữ liệu từ req.
    const {
      homeContractId,
      homeId,
      guestId,
      duration,
      payCycle,
      rental,
      deposit,
      status,
      dateEnd,
      dateStart,
    } = body;

    const updatedHomeContract = await prisma.homeContract.update({
      where: { homeContractsId: Number(id) },
      data: {
        homeId,
        guestId,
        duration,
        payCycle,
        rental,
        deposit,
        status,
        dateEnd,
        dateStart,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedHomeContract);
  } catch (error) {
    console.error("Error updating Home Contract:", error);
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

    const deletedHomeContract = await prisma.homeContract.delete({
      where: { homeContractsId: parseInt(id as string, 10) },
    });
    return NextResponse.json(deletedHomeContract);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
