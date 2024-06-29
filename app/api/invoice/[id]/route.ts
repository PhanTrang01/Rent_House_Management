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
    const { statusPayment, totalSend, totalReceiver } = await _req.json(); // Đọc dữ liệu từ req.

    const updatedHomeowner = await prisma.invoicesPayment.update({
      where: { invoiceId: Number(id) },
      data: {
        statusPayment,
        totalSend: Number(totalSend),
        totalReceiver: Number(totalReceiver),
      },
    });

    return NextResponse.json(updatedHomeowner);
  } catch (error) {
    console.error("Error updating Invoices", error);
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

    const deletedInvoice = await prisma.invoicesPayment.delete({
      where: { invoiceId: parseInt(id as string, 10) },
    });
    return NextResponse.json(deletedInvoice);
  } catch (error) {
    console.error("Error Delete Invoice:", error);
  } finally {
    await prisma.$disconnect();
  }
}
