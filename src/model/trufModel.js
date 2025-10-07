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
        hour: { type: Number, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true },
      },
      close: {
        hour: { type: Number, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true },
      },
    },
    turfUrl: [
      {
        type: String,
        required: [true, "image URL is required"],
      },
    ],

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
      {
        sports: {
          type: String,
          required: [true, "Type of sport is required"],
        },
        gameFormat: {
          type: String,
        },
      },
    ],
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    zap: {
      type: String,
    },
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
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

trufSchema.index({ location: "2dsphere" });

const Truf = mongoose.models.trufs || mongoose.model("trufs", trufSchema);
export default Truf;
