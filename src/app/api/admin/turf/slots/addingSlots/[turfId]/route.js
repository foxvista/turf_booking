import { connect } from "@/lib/db";
import { handleError } from "@/helpers/errorHelper";
import Slot from "@/model/slotModel";
import Turf from "@/model/turfModel";
import { NextResponse } from "next/server";

connect();

export async function POST(request, { params }) {
  try {
    const reqBody = await request.json();
    const { turfId } = await params;
    const { startDate, endDate, period, sports, ground, price } = reqBody;

    if (!turfId) {
      return NextResponse.json(
        { message: "turfId missing in URL params" },
        { status: 400 }
      );
    }
    if (!startDate || !endDate || !price || !period) {
      return NextResponse.json(
        { message: "All field required" },
        { status: 400 }
      );
    }

    const turfData = await Turf.findById(turfId);
    if (!turfData) {
      return NextResponse.json({ message: "Turf not found" }, { status: 404 });
    }

    // --- HELPER FUNCTIONS ---

    /**
     * Parses a "HH:MM" string into a decimal hour number.
     * e.g., "09:30" -> 9.5
     */
    function parseHourString(hourStr) {
      if (typeof hourStr !== 'string' || !hourStr.includes(':')) {
        return NaN;
      }
      const [hour, minute] = String(hourStr).split(':').map(Number);
      if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
        return NaN;
      }
      return hour + (minute / 60);
    }

    /**
     * Formats a decimal hour number back into a "HH:MM" string.
     * e.g., 9.5 -> "09:30"
     */
    function formatDecimalHour(decimalHour) {
      const hour = Math.floor(decimalHour);
      // Get the fractional part and convert it to minutes
      const minuteFraction = decimalHour - hour;
      const minute = Math.round(minuteFraction * 60); // Round to handle precision

      const hourStr = String(hour).padStart(2, '0');
      const minStr = String(minute).padStart(2, '0');
      
      return `${hourStr}:${minStr}`;
    }

    // --- END OF HELPER FUNCTIONS ---

    // defensive: ensure scheduledTime exists and hour strings are present
    const openHourStr = turfData?.scheduledTime?.open?.hour;
    const closeHourStr = turfData?.scheduledTime?.close?.hour;
    
    if (!openHourStr || !closeHourStr) {
      return NextResponse.json(
        { message: "Turf schedule missing open/close hours" },
        { status: 500 }
      );
    }

    // NEW: Parse "HH:MM" string to a decimal number (e.g., 9.5)
    const openTime = parseHourString(openHourStr);
    const closeTime = parseHourString(closeHourStr);

    if (!Number.isFinite(openTime) || !Number.isFinite(closeTime)) {
      return NextResponse.json(
        { message: "Invalid open/close hour format. Expected HH:MM." },
        { status: 500 }
      );
    }
    if (openTime >= closeTime) {
      return NextResponse.json(
        { message: "open time must be before close time" },
        { status: 400 }
      );
    }

    // period should be a positive number (hours)
    const periodHours = Number(period);
    if (!Number.isFinite(periodHours) || periodHours <= 0) {
      return NextResponse.json(
        { message: "Invalid period value. Provide period in hours (number)." },
        { status: 400 }
      );
    }

    // UPDATED: Handles decimal hours and formats to HH:MM
    function generateTimeIntervals(openHour, closeHour, periodHrs) {
      const slots = [];
      // Loop using decimal hours (e.g., 9.5, 10.5, ...)
      for (let hour = openHour; hour < closeHour; hour += periodHrs) {
        const startHour = hour;
        const endHour = Math.min(hour + periodHrs, closeHour); // don't exceed closeHour
        
        // Format decimal hours back to "HH:MM" strings
        const start = formatDecimalHour(startHour);
        const end = formatDecimalHour(endHour);

        // Don't create zero-length slots
        if (start !== end) {
          slots.push({ start, end });
        }
      }
      return slots;
    }

    function generateDatesBetween(startDateIso, endDateIso) {
      const dates = [];
      const current = new Date(startDateIso);
      const end = new Date(endDateIso);
      // normalize times so comparisons are consistent
      current.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // avoid infinite loop on invalid dates
      if (Number.isNaN(current.getTime()) || Number.isNaN(end.getTime()))
        return [];

      while (current <= end) {
        dates.push(new Date(current)); // store each day as Date
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }

    const dates = generateDatesBetween(startDate, endDate);
    if (!dates.length) {
      return NextResponse.json(
        { message: "No dates generated. Check startDate/endDate format." },
        { status: 400 }
      );
    }

    // create the slot documents that match your slotSchema
    const createdSlots = dates.map((dateObj) => {
      // generate base time intervals like [{start: "09:30", end: "10:30"}, ...]
      const timeIntervals = generateTimeIntervals(
        openTime,
        closeTime,
        periodHours
      );

      // map intervals into the shape expected by schema's time subdocument
      const timeArr = timeIntervals.map((t) => ({
        start: t.start,
        end: t.end,
      }));

      return {
        ground: ground || undefined,
        date: dateObj,
        sport: Array.isArray(sports) ? sports : sports ? [sports] : [],
        price: price,
        time: timeArr, // <-- **FIXED: Added this line**
      };
    });

    // create the Slot document (top-level structure depends on your Slot model)
    // here we assume Slot schema has turfId and slots: [ ... ] as shown in your example
    const slotDoc = await Slot.create({
      turfId,
      slots: createdSlots,
    });

    return NextResponse.json(
      {
        message: "Slots generated successfully",
        data: slotDoc, // return created document
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
