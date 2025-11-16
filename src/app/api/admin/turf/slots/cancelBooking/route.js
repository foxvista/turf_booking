import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Slot from "@/model/slotModel";

connect();

export async function PATCH(request) {
  try {
    const userId = getData(request);
    const reqBody = await request.json();
    const { slotDayId, timeSlotId } = reqBody;

    // --- Validation ---
    if (!slotDayId || !timeSlotId || !userId) {
      return NextResponse.json(
        { message: "slotDayId, timeSlotId, and userId are required" },
        { status: 400 }
      );
    }

    const updateResult = await Slot.updateOne(
      {
        "slots._id": slotDayId, // Find the document containing the day
        "slots.time": {
          // Use $elemMatch to find the specific slot that IS booked by THIS user
          $elemMatch: {
            _id: timeSlotId,
            booking: true,
            userId: userId, // <-- This is the crucial check
          },
        },
      },
      {
        // $set the properties on the matched sub-documents
        $set: {
          "slots.$[day].time.$[time].booking": false,
          "slots.$[day].time.$[time].userId": null, // Remove the user
        },
      },
      {
        // arrayFilters defines the placeholders
        arrayFilters: [{ "day._id": slotDayId }, { "time._id": timeSlotId }],
      }
    );

    // Check if the document was actually modified
    if (updateResult.modifiedCount === 0) {
      // If nothing was modified, it means:
      // 1. The slot was not found.
      // 2. The slot was not booked (already canceled).
      // 3. The userId did not match (another user's booking).
      return NextResponse.json(
        { message: "Booking not found, already canceled, or user mismatch" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Booking canceled successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
