import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "turfs",
    required: true,
  },
  bookingTime: {
    bookingFrom: {
      type: String,
      required: [true, "Booking time is required"],
    },
    bookingTo: {
      type: String,
      required: [true, "Booking time is required"],
    },
  },
  sport: {
    type: String,
    required: [true, "Sport type is required"],
  },
  game_format: {
    type: String,
    required: [true, "Game format is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coupons",
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },

  cancelledAt: {
    type: Date,
    default: null,
  },
  alertTimer: {
    type: Boolean,
    default: false,
  },
  timer: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Booking = mongoose.models.bookings || mongoose.model("bookings", bookingSchema);

export default Booking;
