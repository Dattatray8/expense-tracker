import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BudgetLimit from "@/models/budgetLimit.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limits = await BudgetLimit.find({ user: session.user.id })
      .populate("category", "name type")
      .sort({ createdAt: -1 });
    return NextResponse.json({ limits }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { category, limitAmount } = body;
    if (!category || limitAmount == null || limitAmount < 0) {
      return NextResponse.json({ error: "category and limitAmount required" }, { status: 400 });
    }

    const limit = await BudgetLimit.findOneAndUpdate(
      { user: session.user.id, category },
      { limitAmount: Number(limitAmount) },
      { new: true, upsert: true }
    ).populate("category", "name type");
    return NextResponse.json({ limit, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
