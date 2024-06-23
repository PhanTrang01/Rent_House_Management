import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, TypeInvoice } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

// Define an interface for the monthly contracts object
interface MonthlyContracts {
  [key: string]: number;
}

export async function GET(req: NextRequest) {
  try {
    // Fetch and group the contracts by month for the year 2024
    const invoicesByMonth = await prisma.invoicesPayment.groupBy({
      by: ["dateStart", "type"],
      _count: {
        dateStart: true,
      },
      _sum: {
        totalSend: true,
        totalReceiver: true,
      },
      where: {
        dateStart: {
          gte: new Date("2024-01-01"),
          lt: new Date("2025-01-01"),
        },
        type: {
          in: [TypeInvoice.HOME, TypeInvoice.SERVICE],
        },
      },
    });

    // Create maps to store the counts per month for HOME and SERVICE types
    const monthlyHomeInvoices: { [key: string]: number } = {};
    const monthlyServiceInvoices: { [key: string]: number } = {};
    const totalSendInvoice: { [key: string]: number } = {};
    const totalReceiverInvoice: { [key: string]: number } = {};

    // Populate the maps with the counts
    invoicesByMonth.forEach((invoice) => {
      const month = dayjs(invoice.dateStart).format("YYYY-MM");
      if (!totalSendInvoice[month]) {
        totalSendInvoice[month] = 0;
        totalReceiverInvoice[month] = 0;
      }
      totalSendInvoice[month] += invoice._sum.totalSend || 0;
      totalReceiverInvoice[month] += invoice._sum.totalReceiver || 0;

      if (invoice.type === TypeInvoice.HOME) {
        if (!monthlyHomeInvoices[month]) {
          monthlyHomeInvoices[month] = 0;
        }
        monthlyHomeInvoices[month] += invoice._count.dateStart;
      } else if (invoice.type === TypeInvoice.SERVICE) {
        if (!monthlyServiceInvoices[month]) {
          monthlyServiceInvoices[month] = 0;
        }
        monthlyServiceInvoices[month] += invoice._count.dateStart;
      }
    });

    // Ensure all months from January to December are present in the response
    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs(`2024-${i + 1}-01`).format("YYYY-MM")
    );
    const responseData = months.map((month) => ({
      month,
      homeCount: monthlyHomeInvoices[month] || 0,
      serviceCount: monthlyServiceInvoices[month] || 0,
      totalSend: totalSendInvoice[month] || 0,
      totalReceiver: totalReceiverInvoice[month] || 0,
    }));

    // Return the response as JSON
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching contracts by month:", error);

    // Return an error response
    return NextResponse.json(
      { error: "An error occurred while fetching the contracts by month" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
