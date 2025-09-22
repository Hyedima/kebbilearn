import blogPostModel from "@/lib/models/blogPost.model";

import { connect } from "@/lib/mongodb/mongoose";

export const POST = async (req) => {
  try {
    await connect();
    const blogPost = await blogPostModel.find();
    return new Response(JSON.stringify(blogPost), { status: 200 });
  } catch (error) {
    console.log("Error getting blog post", error);
    return new Response("Error getting the blog post", {
      status: 500,
    });
  }
};
