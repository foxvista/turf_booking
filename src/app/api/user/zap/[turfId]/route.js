import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import Turf from "@/model/turfModel";
import { connect } from "mongoose";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
  try {
    const userId = getData(request);
    const { turId } = await params;
    const reqBody = await request.json();
    const { zapLike } = reqBody;

    const turfData = await Turf.findByIdAndUpdate(turId, {
      $push: { zap: { userId, zapLike } },
    });

    return NextResponse.json({ status: 200, message: "zap like updated" });
  } catch (error) {
    return handleError(error);
  }
}
