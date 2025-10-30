import { handleError } from "@/helpers/errorHelper";
import { connect } from "@/lib/db";
import Turf from "@/model/turfModel";
import { getData } from "@/helpers/getData";
import axios from "axios";

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

    //   const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
    //     const encodedAddress = encodeURIComponent(addressString);
    //     const geolocation = `https://geocode.maps.co/search?q=${encodedAddress} & api_key=${process.env.GEOCODING_API}
    // `;
    //     try {
    //       const geoData = await axios.get(geolocation);

    //       console.log(geoData.data,"======");
    //     } catch (error) {
    //       console.log(error);
    //     }

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
        open: { hour: openTime.time },
        close: { hour: closedTime.time },
      },

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
    return handleError(error);
  }
}
