import { connect } from "@/lib/db";
import User from "@/model/userModel";
import { NextResponse } from "next/server";
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

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
