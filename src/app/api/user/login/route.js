import { connect } from "@/lib/db";
import User from "@/model/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const { userName, phoneNumber, password } = reqBody;

    if (!password) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({
      $or: [{ phoneNumber: phoneNumber }, { userName: userName }],
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check password
    const isMatch = await bycrpt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token

    const tokenData = {
      id: user._id,
      userName: user.userName,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set token in HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      status: 200,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
