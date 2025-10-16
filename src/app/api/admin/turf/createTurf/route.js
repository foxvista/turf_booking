import { handleError } from "@/helpers/errorHelper";
import { connect } from "@/lib/db";
import Turf from "@/model/turfModel";
import { getData } from "@/helpers/getData";
connect();

export async function POST(request) {
  try {
    const adminId = getData(request);
    const reqBody = await request.json();
    const {
      ownerName,
      turfName,
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
      !address ||
      !openTime ||
      !closedTime ||
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
      adminId,
      ownerName,
      turfName,
      address: {
        country: address.country,
        state: address.state,
        city: address.city,
        street: address.street,
        zipCode: address.zipCode,
      },

      scheduledTime: {
        open: { hour: openTime.time, period: openTime.period },
        close: { hour: closedTime.time, period: closedTime.period },
      },

      //image url not added
      turfUrl,

      facilitys,
      totalGorunds,
      typeOfSport: typeOfSport.map((sport) => ({
        sports: sport.sports,
        gameFormat: sport.gameFormat,
        hourlyRate: sport.hourlyRate,
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
    handleError(error);
  }
}
