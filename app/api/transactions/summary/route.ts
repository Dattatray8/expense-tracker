import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/transaction.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = session.user.id;
        const user = await User.findById(userId);

        const { searchParams } = new URL(req.url);
        const monthObj = searchParams.get("month");
        const yearObj = searchParams.get("year");

        const currentMonth = monthObj ? Number(monthObj) : new Date().getMonth() + 1;
        const currentYear = yearObj ? Number(yearObj) : new Date().getFullYear();

        const startDate = new Date(currentYear, currentMonth - 1, 1);
        const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

        const aggregateData = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDoc"
                }
            },
            {
                $unwind: {
                    path: "$categoryDoc",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        let incomeFromTransactions = 0;
        let totalExpense = 0;
        const expensesByCategory: Record<string, number> = {};
        
        // Initialize daily data array for the current month
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        const dailyDataArray = Array.from({ length: daysInMonth }, (_, index) => ({
            day: index + 1,
            income: 0,
            expense: 0
        }));

        aggregateData.forEach((tx) => {
            const txDay = new Date(tx.date).getDate();
            
            if (tx.type === "income") {
                incomeFromTransactions += tx.amount;
                dailyDataArray[txDay - 1].income += tx.amount;
            } else if (tx.type === "expense") {
                totalExpense += tx.amount;
                dailyDataArray[txDay - 1].expense += tx.amount;
                // Category chart data
                const catName = tx.categoryDoc?.name || "Uncategorized";
                expensesByCategory[catName] = (expensesByCategory[catName] || 0) + tx.amount;
            }
        });

        const totalIncome = (user?.monthlyIncome || 0) + incomeFromTransactions;
        const remainingBalance = totalIncome - totalExpense;

        const chartData = Object.keys(expensesByCategory).map(key => ({
            name: key,
            value: expensesByCategory[key]
        }));

        return NextResponse.json({
            month: currentMonth,
            year: currentYear,
            baseIncome: user?.monthlyIncome || 0,
            transactionIncome: incomeFromTransactions,
            totalIncome,
            totalExpense,
            remainingBalance,
            expensesByCategory: chartData,
            dailyData: dailyDataArray
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
