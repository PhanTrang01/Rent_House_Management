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
    const { id: homeId } = params;
    const home = await prisma.homes.findUniqueOrThrow({
      include: {
        homeowner: true,
      },
      where: {
        homeId: Number(homeId),
      },
    });

    return NextResponse.json(home);
  } catch (error) {
    console.error("Error find Home:", error);
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

    const existingContract = await prisma.homeContract.findFirst({
      where: { homeId: Number(id) },
    });
    if (existingContract) {
      // Nếu có, trả về lỗi
      return NextResponse.json(
        { message: "Không thể xóa Căn hộ đã phát sinh hợp đồng" },
        { status: 400 }
      );
    }

    const deletedHome = await prisma.homes.delete({
      where: { homeId: parseInt(id as string, 10) },
    });
    return NextResponse.json(deletedHome);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
