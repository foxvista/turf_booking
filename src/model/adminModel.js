import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
      minlength: 3,
    },
    phoneNumber: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
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
    // Verification and Security
    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumberVerificationToken: {
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
    reports: [],

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

const Admin = mongoose.models.admins || mongoose.model("admins", adminSchema);

export default Admin;
