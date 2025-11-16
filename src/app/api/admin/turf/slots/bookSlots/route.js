import { getData } from "@/helpers/getData";
import { connect } from "@/lib/db";
import Slot from "@/model/slotModel";

connect();

export async function PATCH(request) {
  try {
    const userId = getData(request);
    const reqBody = await request.json();
    const { slotDayId, timeSlotId } = reqBody;

    if (!slotDayId || !timeSlotId || !userId) {
      return NextResponse.json(
        { message: "slotDayId, timeSlotId, and userId are required" },
        { status: 400 }
      );
    }

    // This is an atomic operation to prevent race conditions (double bookings).
    // It finds the Slot document that contains a 'slots' element matching 'slotDayId'
    // AND which itself contains a 'time' element matching 'timeSlotId' AND 'booking: false'.
    const updateResult = await Slot.updateOne(
      {
        "slots._id": slotDayId, // Find the document containing the day
        "slots.time": {
          // Use $elemMatch to find the specific time slot that is NOT booked
          $elemMatch: {
            _id: timeSlotId,
            booking: false,
          },
        },
      },
      {
        // $set the properties on the matched sub-documents
        $set: {
          "slots.$[day].time.$[time].booking": true,
          "slots.$[day].time.$[time].userId": userId,
        },
      },
      {
        // arrayFilters defines the placeholders used in the $set operation
        arrayFilters: [{ "day._id": slotDayId }, { "time._id": timeSlotId }],
      }
    );

    // Check if the document was actually modified
    if (updateResult.modifiedCount === 0) {
      // If no document was modified, it means the slot was not found OR
      // it was already booked (the "booking: false" condition failed).
      return NextResponse.json(
        { message: "Slot not found or is already booked" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Slot booked successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
