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
    const receiver = await prisma.receiver.findUniqueOrThrow({
      where: {
        receiverId: Number(id),
      },
    });
    return NextResponse.json(receiver);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
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
    const { name, phone, email, taxcode, STK, TenTK, Nganhang, note, type } =
      await _req.json();

    const deleted = await prisma.receiver.update({
      where: { receiverId: parseInt(id as string, 10) },
      data: {
        name,
        phone,
        email,
        taxcode,
        STK,
        TenTK,
        Nganhang,
        note,
        type,
      },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error Update  Service:", error);
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

    const deleted = await prisma.receiver.delete({
      where: { receiverId: parseInt(id as string, 10) },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
