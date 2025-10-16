import { connect } from "@/lib/db";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from"@/model/adminModel"
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  const reqBody = await request.json();

  const { userName, phoneNumber, password } = reqBody;

  if (!password) {
    return NextResponse.json(
      { error: "Please fill all the fields" },
      { status: 400 }
    );
  }

  // Check if Admin exists
  const adminData = await Admin.findOne({
    $or: [{ phoneNumber: phoneNumber }, { userName: userName }],
  });
  if (!adminData) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  // Check password
  const isMatch = await bycrpt.compare(password, adminData.hashedPassword);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Generate JWT token

  const tokenData = {
    id: adminData._id,
    AdminName: adminData.AdminName,
    role: adminData.role,
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
}
