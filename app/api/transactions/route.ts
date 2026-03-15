import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/transaction.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const limitStr = searchParams.get("limit");
        const monthStr = searchParams.get("month");
        const yearStr = searchParams.get("year");

        let query: any = Transaction.find({ user: session.user.id })
            .sort({ date: -1 })
            .populate("category", "name color icon type");

        if (monthStr && yearStr) {
            const m = Number(monthStr);
            const y = Number(yearStr);
            const start = new Date(y, m - 1, 1);
            const end = new Date(y, m, 0, 23, 59, 59, 999);
            query = query.where("date").gte(start).lte(end);
        }
        if (limitStr) query = query.limit(Number(limitStr));

        const transactions = await query;
        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { amount, type, category, date, description, name } = body;

        if (!amount || !type || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newTx = await Transaction.create({
            user: session.user.id,
            amount: Number(amount),
            type,
            category,
            date: date ? new Date(date) : new Date(),
            description: name || description || "", // Fallback
        });

        // Populate so UI has right details
        const populatedTx = await Transaction.findById(newTx._id).populate("category", "name color icon type");

        return NextResponse.json({ transaction: populatedTx, success: true }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
