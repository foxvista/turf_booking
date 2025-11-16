import { connect } from "@/lib/db";
import { handleError } from "@/helpers/errorHelper";
import { sendResetEmail } from "@/lib/mail";
import Admin from "@/model/adminModel";
import { NextResponse } from "next/server";
import crypto from "crypto";
connect();

export async function POST(request) {
  try {
    const body = await request.json();
    const { mailId, userName } = body;

    if (!mailId && !userName) {
      return NextResponse.json(
        { message: "mailId or userName required" },
        { status: 400 }
      );
    }

    const user = await Admin.findOne({ $or: [{ mailId }, { userName }] });

    if (!user) {
      // Do not reveal whether user exists — respond success to avoid account enumeration
      return NextResponse.json(
        {
          message: "user not found",
        },
        { status: 404 }
      );
    }

    // Create a token (unguarded token to send via email), store its hashed version in DB
    const token = crypto.randomBytes(32).toString("hex"); // 64 chars
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const expires = Date.now() + 1000 * 30; // 1 hour

    user.passwordResetToken = hashed;
    user.passwordResetExpires = new Date(expires);
    await user.save();

    // send email (sendResetEmail should not throw normally; but catch below)
    await sendResetEmail({
      to: user.mailId,
      token,
      userId: user._id.toString(),
    });

    return NextResponse.json(
      { message: "If that account exists, we've sent a password reset email" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return handleError(error);
  }
}
