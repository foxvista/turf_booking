import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  matchName: {
    type: String,
    required: [true, "Match name is required"],
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
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  sports: {
    type: String,
    required: [true, "Sport type is required"],
  },
  payAndJoin: {
    type: Boolean,
    default: false,
  },
  splitAmount: {
    type: Boolean,
    default: false,
  },
  gameType: {
    type: String,
    enum: ["regular", "team", "tournament"],
    default: "regular",
  },
  regular: {
    type: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    totalPlayers: Number,
  },
  team: {
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "teams" }],
    totalPlayers: Number,
  },
  tournament: {
    entryFee: Number,
    prize: Number,
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "teams" }],
    totalTeams: Number,
  },

  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Match = mongoose.models.matches || mongoose.model("matches", matchSchema);
export default Match;
