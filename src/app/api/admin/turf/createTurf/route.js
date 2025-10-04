import { connect } from "@/lib/db";
import Turf from "@/model/trufModel";
connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const {
      ownerName,
      turfName,
      location,
      address,
      openTime,
      closedTime,
      turfUrl,
      facilitys,
      totalGorunds,
      typeOfSport,
      desciption,
    } = reqBody;

    // verification for empty fields

    if (
      !ownerName ||
      !turfName ||
      !location ||
      !address ||
      !scheduledTime ||
      !turfUrl ||
      !totalGorunds ||
      !typeOfSport
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    // check if turf already exists
    const existingTurf = await Turf.aggregate([
      { $match: { turfName: turfName } },
      {
        $project: {
          turfName: 1,
          addressMatch: { $eq: ["$address", address] },
        },
      },
    ]);

    if (existingTurf.length > 0) {
      return new Response(JSON.stringify({ error: "Turf already exists" }), {
        status: 400,
      });
    }

    // create new turf

    const newTurf = new Turf({
      ownerName,
      turfName,
      location,
      address,
      scheduledTime: {
        open: { hour: openTime.time, period: openTime.period },
        close: { hour: closedTime.time, period: closedTime.period },
      },
      turfUrl,
      facilitys,
      totalGorunds,
      typeOfSport: typeOfSport.map((sport) => ({
        sports: sport.sports,
        gameFormat: sport.gameFormat,
      })),
      desciption,
    });

    await newTurf.save();

    return new Response(
      JSON.stringify({ message: "Turf registered successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error in registration route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
