import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address."],
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    phoneNumber: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: true,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default: null, // Or a path to a default profile picture
    },
    role: {
      type: String,
      enum: ["user", "superadmin", "admin"],
      default: "user",
    },

    // Location information using GeoJSON format for geospatial queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    // Verification and Security
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },

    // Moderation and Status
    isBlocked: {
      type: Boolean,
      default: false,
    },
    reports: [reportSchema],

    // Array to store references to bookings made by the user
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking", // This refers to a 'Booking' model
      },
    ],
  },
  {
    // Add timestamps automatically
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

export default User;
