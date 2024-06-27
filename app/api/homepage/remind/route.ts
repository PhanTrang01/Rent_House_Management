import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function GET(req: NextRequest) {
  try {
    // Define the start date
    const startDate = new Date();

    // Define the end date as today
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    // Fetch the sum of totalSend from the Invoice table within the date range
    const responseData = await prisma.invoicesPayment.findMany({
      where: {
        datePaymentReal: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        home: true,
        receiver: true,
        homeContract: true,
        serviceContract: true,
      },
    });

    // Return the response as JSON
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error read data:", error);
  } finally {
    await prisma.$disconnect();
  }
}
