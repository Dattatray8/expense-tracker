import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/models/transaction.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.amount != null) update.amount = Number(body.amount);
    if (body.type != null) update.type = body.type;
    if (body.category != null) update.category = body.category;
    if (body.date != null) update.date = new Date(body.date);
    if (body.description != null) update.description = body.description;
    if (body.name != null) update.description = body.name;

    const tx = await Transaction.findOneAndUpdate(
      { _id: id, user: session.user.id },
      update,
      { new: true }
    ).populate("category", "name color icon type");
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    return NextResponse.json({ transaction: tx, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const tx = await Transaction.findOneAndDelete({ _id: id, user: session.user.id });
    if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
