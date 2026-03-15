import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/category.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = session.user.id;
        
        // Seed default categories if none exist and return them
        const defaultNames = ["Food", "Travel", "Education", "Entertainment"];
        for (const name of defaultNames) {
            const exists = await Category.findOne({ name, user: { $eq: null } });
            if (!exists) {
                await Category.create({ name, type: "expense", user: null });
            }
        }
        
        // Add one default income just in case
        const incExists = await Category.findOne({ name: "Salary", user: { $eq: null } });
        if (!incExists) {
             await Category.create({ name: "Salary", type: "income", user: null });
        }

        const categories = await Category.find({
            $or: [{ user: null }, { user: userId }],
        }).sort({ name: 1 });

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
