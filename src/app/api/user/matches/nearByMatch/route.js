import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Match from "@/model/createMatchModel";
import User from "@/model/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
  try {
    const userId = getData(request);
    const user = await User.findById(userId).select("location");

    const nearbyMatches = await Match.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: user.location.coordinates,
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 5000, // in meters
        },
      },
    ]);

    return NextResponse.json(nearbyMatches);
  } catch (error) {
    handleError(error);
  }
}
