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
    const { statusPayment, totalSend, totalReceiver, dateRemind } =
      await _req.json(); // Đọc dữ liệu từ req.

    const newdatePaymentExpect = new Date(dateRemind);
    newdatePaymentExpect.setDate(newdatePaymentExpect.getDate() + 5);

    const newdatePaymentReal = new Date(dateRemind);
    newdatePaymentReal.setDate(newdatePaymentReal.getDate() + 7);

    const updatedHomeowner = await prisma.invoicesPayment.update({
      where: { invoiceId: Number(id) },
      data: {
        statusPayment,
        totalSend: Number(totalSend),
        totalReceiver: Number(totalReceiver),
        datePaymentRemind: new Date(dateRemind),
        datePaymentExpect: newdatePaymentExpect,
        datePaymentReal: newdatePaymentReal,
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
