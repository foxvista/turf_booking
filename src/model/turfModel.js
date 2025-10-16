import mongoose from "mongoose";

const turfSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: true,
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
    },

    turfName: {
      type: String,
      required: [true, "Turf name is required"],
    },

    address: {
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      street: {
        type: String,
        required: [true, "Street is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
      },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    turfUrl: [
      {
        type: String,
        required: [true, "image URL is required"],
      },
    ],

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
        hourlyRate: {
          type: Number,
          required: [true, "rate is required"],
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

turfSchema.index({ location: "2dsphere" });

const Turf = mongoose.models.trufs || mongoose.model("turfs", turfSchema);
export default Turf;
