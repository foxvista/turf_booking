import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  groupCode: {
    type: String,
    required: true,
  },
  totalMember: {
    type: Number,
  },
  description: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  members: [
    {
      userId: {
        type: String,
        required: true,
      },
      accept: {
        type: Boolean,
        default: false,
      },
      admin: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  delete: {
    type: Boolean,
    default: false,
  },
});

const Group = mongoose.models.groups || mongoose.model("groups", groupSchema);
export default Group;
