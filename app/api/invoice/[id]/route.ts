import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { statusPayment } = await _req.json(); // Đọc dữ liệu từ req.

    const updatedHomeowner = await prisma.invoicesPayment.update({
      where: { invoiceId: Number(id) },
      data: {
        statusPayment,
      },
    });

    return NextResponse.json(updatedHomeowner);
  } catch (error) {
    console.error("Error updating Home Owner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
