import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, homeInvoice } from "@prisma/client";
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
    const { homeId, guestId, cycle, datePayment, rental, duration } =
      await req.json();

    const times = duration / cycle;
    const totalPay = rental * cycle;
    for (let index = 0; index < times; index++) {
      // Create a new Date object and add cycle*index months
      // const datePayment = new Date();
      const newDatePayment = new Date(datePayment);
      newDatePayment.setMonth(newDatePayment.getMonth() + cycle * index);

      const Invoice = await prisma.homeInvoice.create({
        data: {
          homeId: Number(homeId),
          guestId: Number(guestId),
          datePayment: new Date(newDatePayment),
          cyclePayment: Number(cycle),
          totalPayment: Number(totalPay),
          statusPayment: Boolean(false),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      lastInvoice = Invoice;
    }
    return NextResponse.json(lastInvoice);
  } catch (error) {
    console.error("Error create Home Invoice:", error);
  } finally {
    await prisma.$disconnect();
    // return NextResponse.json({ message: "Operation completed successfully" });
  }
}
