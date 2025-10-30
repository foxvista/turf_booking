import { handleError } from "@/helpers/errorHelper";
import { connect } from "@/lib/db";
import Turf from "@/model/turfModel";

connect();

export async function GET(request) {
  try {
    // Extract query params (latitude, longitude, distance)
    const { searchParams } = new URL(request.url);
    const latitude = parseFloat(searchParams.get("latitude"));
    const longitude = parseFloat(searchParams.get("longitude"));
    const distance = parseFloat(searchParams.get("distance")) || 10; // default 5km

    if (!latitude || !longitude) {
      return NextResponse.json(
        { message: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // Convert distance to meters
    const radius = distance * 1000;

    const turfs = await Turf.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius, // max distance in meters
        },
      },
    });

    res.status(200).json({
      status: 200,
      count: turfs.length,
      data: turfs,
    });
  } catch (error) {
    return handleError(error);
  }
}
