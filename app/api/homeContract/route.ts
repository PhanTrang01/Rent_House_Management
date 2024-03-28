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
    const { homeId, guestId, cycle, dateRent, rental, duration } =
      await req.json();

    const times = duration / cycle;
    const totalPay = rental * cycle;
    for (let index = 0; index < times; index++) {
      // Create a new Date object and add cycle*index months
      // const datePayment = new Date();
      const newDatePayment = new Date(dateRent);
      newDatePayment.setMonth(newDatePayment.getMonth() + cycle * index);

      const Invoice = await prisma.homeContract.create({
        data: {
          homeId: Number(homeId),
          guestId: Number(guestId),
          datePayment: new Date(newDatePayment),
          total: Number(totalPay),
          statusPayment: Boolean(false),
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
