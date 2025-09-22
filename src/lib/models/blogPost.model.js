import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createAndUpdatedBy: {
      type: String,
      required: true,
      trim: true,
      default: "inngest",
    },
  },
  { timestamps: true }
);

const blogPostModel =
  mongoose.models.blogPost || mongoose.model("blogPost", blogPostSchema);

export default blogPostModel;
