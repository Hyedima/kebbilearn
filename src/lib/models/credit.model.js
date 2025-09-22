import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    creditAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 11, // default credits for new users
    },
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Credit = mongoose.models.Credit || mongoose.model("Credit", creditSchema);

export default Credit;
