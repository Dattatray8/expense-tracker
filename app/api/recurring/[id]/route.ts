import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Recurring from "@/models/recurring.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const rec = await Recurring.findOneAndDelete({ _id: id, user: session.user.id });
    if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
