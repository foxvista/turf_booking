import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Turf from "@/model/turfModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request) {
  try {
    const adminId = getData(request);
    const reqBody = await request.json();

    // Prepare updateData dynamically
    const updateData = {};

    if (reqBody.ownerName) updateData.ownerName = reqBody.ownerName;
    if (reqBody.turfName) updateData.turfName = reqBody.turfName;

    if (reqBody.address) {
      updateData.address = {
        ...(reqBody.address.country && { country: reqBody.address.country }),
        ...(reqBody.address.state && { state: reqBody.address.state }),
        ...(reqBody.address.city && { city: reqBody.address.city }),
        ...(reqBody.address.street && { street: reqBody.address.street }),
        ...(reqBody.address.zipCode && { zipCode: reqBody.address.zipCode }),
      };
    }

    if (reqBody.openTime || reqBody.closedTime) {
      updateData.scheduledTime = {
        ...(reqBody.openTime && {
          open: {
            hour: reqBody.openTime.time,
            period: reqBody.openTime.period,
          },
        }),
        ...(reqBody.closedTime && {
          close: {
            hour: reqBody.closedTime.time,
            period: reqBody.closedTime.period,
          },
        }),
      };
    }

    if (reqBody.turfUrl) updateData.turfUrl = reqBody.turfUrl;
    if (reqBody.facilitys) updateData.facilitys = reqBody.facilitys;
    if (reqBody.totalGorunds) updateData.totalGorunds = reqBody.totalGorunds;

    if (reqBody.typeOfSport) {
      updateData.typeOfSport = reqBody.typeOfSport.map((sport) => ({
        ...(sport.sports && { sports: sport.sports }),
        ...(sport.gameFormat && { gameFormat: sport.gameFormat }),
        ...(sport.hourlyRate && { hourlyRate: sport.hourlyRate }),
      }));
    }

    if (reqBody.desciption) updateData.desciption = reqBody.desciption;

    const turfData = await Turf.findOneAndUpdate(
      { adminId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!turfData) {
      return NextResponse.json(
        { message: "Turf not found for this admin", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Turf updated successfully",
      status: 200,
      turfData,
    });
  } catch (error) {
    handleError(error);
  }
}
