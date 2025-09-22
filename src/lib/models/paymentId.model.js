import mongoose from "mongoose";

const PaymentIDSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },
    callerUserId: {
      type: String,
      required: true, // From Polar (external user ID)
    },
    userId: {
      type: String,
      required: true, // MongoDB user's _id
    },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentID ||
  mongoose.model("PaymentID", PaymentIDSchema);
