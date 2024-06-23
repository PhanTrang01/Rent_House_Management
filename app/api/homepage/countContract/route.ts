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

// Define an interface for the monthly contracts object
interface MonthlyContracts {
  [key: string]: number;
}

export async function GET(req: NextRequest) {
  try {
    // Fetch and group the contracts by month for the year 2024
    const contractsByMonth = await prisma.homeContract.groupBy({
      by: ["dateStart"],
      _count: {
        dateStart: true,
      },
      where: {
        dateStart: {
          gte: new Date("2024-01-01"),
          lt: new Date("2025-01-01"),
        },
      },
    });

    // Transform the result to group by month
    const monthlyContracts: { [key: string]: number } = {};

    // Populate the map with the counts
    contractsByMonth.forEach((contract) => {
      const month = dayjs(contract.dateStart).format("YYYY-MM");
      if (!monthlyContracts[month]) {
        monthlyContracts[month] = 0;
      }
      monthlyContracts[month] += contract._count.dateStart;
    });

    // Ensure all months from January to December are present in the response
    const months = Array.from({ length: 12 }, (_, i) =>
      dayjs(`2024-${i + 1}-01`).format("YYYY-MM")
    );
    const responseData = months.map((month) => ({
      month,
      count: monthlyContracts[month] || 0,
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
