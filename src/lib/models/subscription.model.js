import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    customerEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    productId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
