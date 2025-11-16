import { handleError } from "@/helpers/errorHelper";
import { connect } from "@/lib/db";
import Slot from "@/model/slotModel";
import { NextResponse } from "next/server";

connect();

export async function PATCH(request) {
  try {
    const reqBody = await request.json();
    const { slotDayId, price, sports, ground, active } = reqBody;


    if (!slotDayId) {
      return NextResponse.json(
        { message: "slotDayId is required" },
        { status: 400 }
      );
    }

    // Build the $set object dynamically based on what was provided
    const fieldsToUpdate = {};
    if (price) fieldsToUpdate["slots.$[day].price"] = price;
    if (sports) fieldsToUpdate["slots.$[day].sport"] = sports; // Assumes 'sports' is the full new array
    if (ground) fieldsToUpdate["slots.$[day].ground"] = ground;
    if (typeof active === "boolean")
      fieldsToUpdate["slots.$[day].active"] = active;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update were provided" },
        { status: 400 }
      );
    }

    // Find the parent Slot doc by the 'slotDayId' and update its properties
    const updateResult = await Slot.updateOne(
      { "slots._id": slotDayId },
      {
        $set: fieldsToUpdate,
      },
      {
        arrayFilters: [{ "day._id": slotDayId }],
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Slot day not found or no changes detected" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Slot day updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
