import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "turfs",
    required: true,
  },
  slots: [
    {
      date: { type: Date, default: Date.now },
      time: [
        {
          start: { type: String, required: true },
          end: { type: String, required: true },
          booking: { type: Boolean, default: false },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null,
          },
        },
      ],
    },
  ],
});

const Slot = mongoose.models.slots || mongoose.model("slots", slotSchema);

export default Slot;
