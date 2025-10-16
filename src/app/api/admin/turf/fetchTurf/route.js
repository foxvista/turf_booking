import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import Turf from "@/model/turfModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  try {
    const adminId = getData(request);

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const turfData = await Turf.findOne({ adminId });

    if (!turfData || turfData.deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: "Data fetched successfully.",
      turfData,
    });
  } catch (error) {
    handleError(error);
  }
}
