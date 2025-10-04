import mongoose from "mongoose";

const trufSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
    },
    turfName: {
      type: String,
      required: [true, "Turf name is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        // required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true,
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    scheduledTime: {
      open: {
        type: Number,
        required: [true, "Scheduled time is required"],
        enum: ["AM", "PM"],
      },
      close: {
        type: Number,
        required: [true, "Scheduled time is required"],
        enum: ["AM", "PM"],
      },
    },
    turfImageUrl: [
      {
        type: String,
        required: [true, "image URL is required"],
      },
    ],
    turfVideoUrl: [{ type: String }],
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
    },
    facilitys: [{ type: String }],
    totalGorunds: {
      type: Number,
      required: [true, "Total grounds is required"],
    },
    typeOfSport: [
      { type: String, required: [true, "Type of sport is required"] },
    ],
    game_format: [
      { type: String, required: [true, "Game format is required"] },
    ],
    desciption: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deleted:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const CreateTruf = mongoose.models.trufs || mongoose.model("trufs", trufSchema);
export default CreateTruf;
