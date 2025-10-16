import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Match from "@/model/createMatchModel";
import { NextResponse } from "next/server";
connect();

export async function GET(request) {
  try {
    const id = getData(request);

    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const createdMatch = await Match.findById(id);

    return NextResponse.json({
      status: 200,
      message: "Data fetched successfully.",
      createdMatch,
    });
  } catch (error) {
    handleError(error);
  }
}
