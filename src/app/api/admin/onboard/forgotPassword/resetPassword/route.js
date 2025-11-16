// app/api/auth/reset/route.js
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { handleError } from "@/helpers/errorHelper";
import Admin from "@/model/adminModel";

connect();

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, userId, newPassword } = body;

    if (!token || !userId || !newPassword) {
      return NextResponse.json(
        { message: "token, userId and newPassword required" },
        { status: 400 }
      );
    }

    // Hash the incoming token to compare with DB hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Admin.findOne({
      _id: userId,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Validate password strength on server-side as needed (example: min 8 chars)
    // if (newPassword.length < 8) {
    //   return NextResponse.json(
    //     { message: "Password must be at least 8 characters" },
    //     { status: 400 }
    //   );
    // }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (err) {
    return handleError(err);
  }
}
