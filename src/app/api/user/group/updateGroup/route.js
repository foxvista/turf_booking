import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Group from "@/model/groupModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function PUT(request, { params }) {
  try {
    const userId = params;
    const reqBody = await request.json();

    const updatedData = await Group.findByIdAndUpdate(
      userId,
      { $set: reqBody },
      { new: true }
    );

    if (!updatedData) {
      return NextResponse.json({ status: 404, message: "group not found" });
    }

    return NextResponse.json({
      status: 200,
      message: "group updated succesfully",
      updatedData,
    });
  } catch (error) {
    return handleError(error);
  }
}
