import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "@/lib/prisma";

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL, // Make sure this URL is correctly set
//     },
//   },
// });

export async function GET(req: NextRequest) {
  try {
    // Fetch the total number of homes
    const totalHomes = await prisma.homes.count();
    // Fetch the total number of home contracts
    const totalHomeContracts = await prisma.homeContract.count();
    // Fetch the total number of service contracts
    const totalSContracts = await prisma.serviceContract.count();
    // Fetch the total number of service invoices
    const totalInvoices = await prisma.invoicesPayment.count();

    // Define the start date
    const startDate = dayjs("2024-01-01").toDate();

    // Define the end date as today
    const endDate = new Date();

    // Fetch the sum of totalSend from the Invoice table within the date range
    const totalSum = await prisma.invoicesPayment.aggregate({
      _sum: {
        totalSend: true,
        totalReceiver: true,
      },
      where: {
        dateStart: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Prepare the response data
    const responseData = {
      totalHomes,
      totalHomeContracts,
      totalSContracts,
      totalInvoices,
      totalSendSum: totalSum._sum.totalSend || 0,
      totalReceiverSum: totalSum._sum.totalReceiver || 0,
    };

    // Return the response as JSON
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error read data:", error);
  } finally {
    await prisma.$disconnect();
  }
}
