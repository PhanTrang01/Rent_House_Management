import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { type } from "os";
import { useState } from "react";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function POST(req: Request) {
  try {
    let lastInvoice;
    const {
      serviceContractId,
      homeContractId,
      homeId,
      dateStart,
      limit,
      receiverId,
      duration,
      cycle,
      rental,
      datePaymentRemind,
      datePaymentReal,
    } = await req.json();

    const times = duration / cycle;
    const totalPay = rental * cycle;
    for (let index = 0; index < times; index++) {
      // Create a new Date object and add cycle*index months
      // const datePayment = new Date();
      const newDatePayment = new Date(dateStart);
      newDatePayment.setMonth(newDatePayment.getMonth() + cycle * index);
      const nextDatePayment = new Date(newDatePayment);
      nextDatePayment.setMonth(newDatePayment.getMonth() + cycle);

      const Invoice = await prisma.invoicesPayment.create({
        data: {
          serviceContractId: Number(serviceContractId),
          homeContractId: Number(homeContractId),
          homeId: Number(homeId),
          type: "EVN",
          dateStart: newDatePayment,
          dateEnd: nextDatePayment,
          total: Number(totalPay),
          limit: Number(duration),
          receiverId: Number(receiverId),
          datePaymentExpect: newDatePayment,
          datePaymentRemind: new Date(datePaymentRemind),
          datePaymentReal: new Date(datePaymentReal),
          statusPayment: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      lastInvoice = Invoice;
    }
    return NextResponse.json(lastInvoice);
  } catch (error) {
    console.error("Error create Home Contract:", error);
  } finally {
    await prisma.$disconnect();
    // return NextResponse.json({ message: "Operation completed successfully" });
  }
}