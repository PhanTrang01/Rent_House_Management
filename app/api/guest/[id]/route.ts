import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

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

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await _req.json(); // Đọc dữ liệu từ req.

    const {
      fullname,
      phone,
      email,
      hometown,
      citizenId,
      citizen_ngaycap,
      citizen_noicap,
      birthday,
      Note,
    } = body;

    const updatedHomeowner = await prisma.guests.update({
      where: { guestId: Number(id) },
      data: {
        fullname,
        phone,
        email,
        citizenId,
        citizen_ngaycap,
        citizen_noicap,
        birthday,
        hometown,
        Note,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedHomeowner);
  } catch (error) {
    console.error("Error updating Home Owner:", error);
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

    const Contract = await prisma.homeContract.findMany({
      where: {
        guestId: Number(id),
      },
    });
    if (Contract.length > 0) {
      // Nếu có, trả về lỗi
      return NextResponse.json(
        {
          message: "Khách hàng đã phát sinh hợp đồng thuê căn hộ không thể xóa",
        },
        { status: 400 }
      );
    }

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
