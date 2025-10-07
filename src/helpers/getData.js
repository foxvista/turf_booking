import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function getData(req) {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    return decode.id;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
