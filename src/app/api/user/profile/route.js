import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import User from "@/model/userModel";
import { NextResponse } from "next/server";
connect();

export async function GET(request) {
  try {
    const user = getData(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await User.findById(user).select(
      "-hashedPassword -reports -__v -updatedAt"
    );

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
