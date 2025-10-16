import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import Turf from "@/model/turfModel";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const adminId = getData(request);
    const reqBody = await request.json();

    console.log(reqBody);

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Turf.findOneAndUpdate({ adminId }, reqBody, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "deleted succesfully",
      status: 200,
    });
  } catch (error) {
    handleError(error);
  }
}
