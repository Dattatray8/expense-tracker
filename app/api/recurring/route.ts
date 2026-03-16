import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Recurring from "@/models/recurring.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const list = await Recurring.find({ user: session.user.id })
      .populate("category", "name type")
      .sort({ dayOfMonth: 1 });
    return NextResponse.json({ recurring: list }, { status: 200 });
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
    const { title, amount, type, category, dayOfMonth } = body;
    if (!title || amount == null || !type || dayOfMonth == null) {
      return NextResponse.json({ error: "title, amount, type, dayOfMonth required" }, { status: 400 });
    }
    const day = Math.min(31, Math.max(1, Number(dayOfMonth)));
    const rec = await Recurring.create({
      user: session.user.id,
      title,
      amount: Number(amount),
      type,
      category: category || null,
      dayOfMonth: day,
    });
    const populated = await Recurring.findById(rec._id).populate("category", "name type");
    return NextResponse.json({ recurring: populated, success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
