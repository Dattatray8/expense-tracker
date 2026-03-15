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

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { name, type } = body;
        if (!name || !type) {
            return NextResponse.json({ error: "Name and type (income/expense) required" }, { status: 400 });
        }
        if (!["income", "expense"].includes(type)) {
            return NextResponse.json({ error: "Type must be income or expense" }, { status: 400 });
        }

        const trimmedName = String(name).trim();
        const existing = await Category.findOne({
            name: new RegExp(`^${trimmedName}$`, "i"),
            $or: [{ user: null }, { user: session.user.id }],
        });
        if (existing) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const category = await Category.create({
            name: trimmedName,
            type,
            user: session.user.id,
        });
        return NextResponse.json({ category, success: true }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
