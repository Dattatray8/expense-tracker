import connectDB from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface SignUpInputData {
  username: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } : SignUpInputData = await req.json();
    await connectDB();
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email.",
        },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password contain atleast 8 characters.",
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Signup successfully.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Internal server error for signup : ${error}`,
      },
      { status: 500 }
    );
  }
}