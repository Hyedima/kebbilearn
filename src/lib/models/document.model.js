import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    clerkUserId: { type: String, required: true },
    name: { type: String, required: true }, // ✅ Add file name field
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);

const documentModel =
  mongoose.models.document || mongoose.model("document", documentSchema);

export default documentModel;
