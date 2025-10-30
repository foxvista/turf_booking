import { connect } from "@/lib/db";
import Slot from "@/model/slotModel";
import Turf from "@/model/turfModel";

connect();

export async function POST(request, { params }) {
  const reqBody = await request.json();
  const { turfId } = params;
  const { startDate, endDate, period } = reqBody;

  const turfData = await Turf.findById(turfId);

  const openTime = turfData.scheduledTime.open.hour;
  const closeTime = turfData.scheduledTime.close.hour;

  function generateTimeIntervals(openHour, closeHour, period) {
    const slots = [];

    for (let hour = openHour; hour < closeHour; hour += period) {
      const startHour = hour;
      const endHour = hour + period;

      const start = `${String(startHour).padStart(2, "0")}:00`;
      const end = `${String(endHour).padStart(2, "0")}:00`;

      slots.push({ start, end });
    }

    return slots;
  }

  function generateDatesBetween(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);

    while (current <= new Date(endDate)) {
      dates.push(new Date(current)); // store each day
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  const dates = generateDatesBetween(startDate, endDate);
  const allSlots = [];

  for (const date of dates) {
    const timeSlots = generateTimeIntervals(openHour, closeHour, period);
    allSlots.push({ date, time: timeSlots });
  }

  await Slot.create({
    turfId,
    slots: allSlots,
  });

  return NextResponse.json({
    message: "Slots generated successfully",
    data: allSlots,
  });
}
