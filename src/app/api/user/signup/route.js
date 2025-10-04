import { connect } from "@/lib/db";
import User from "@/model/userModel";
import { NextResponse, NextRequest } from "next/server";
import bycrpt from "bcrypt";
connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { userName, fullName, password, phoneNumber } = reqBody;
    console.log(reqBody);

    if (!userName || !fullName || !password || !phoneNumber) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }

    //existing user check based on phone number

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // phone number validation

    //password hashing

    const hashedPassword = await bycrpt.hash(password, 10);

    const data = new User({
      userName,
      fullName,
      hashedPassword: hashedPassword,
      phoneNumber,
    });

    await data.save();

    return NextResponse.json({ message: "Signup successful" }, { status: 200 });
  } catch (error) {
    console.log(error.message);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
