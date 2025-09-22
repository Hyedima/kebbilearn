//
//
//
//
//
// const prompt = `
// Write a detailed and engaging blog post on the topic: "${selectedKeyword}" and provide a title and description in ONLY the following JSON format:

// {
//   "title": "An informative, helpful and suitable title with around 50 characters",
//   "description": "An informative and financially helpful article for people who use a bank statement converter to convert their bank statements from PDF to Excel or CSV. Also mention that the app does more than conversion—it analyzes the data, assists with analytics, data cleaning, and grouping."
// }

// Let it be around 150 words. Do not include anything outside the JSON response. Also make it informative, helpful, and suitable for a financial education platform.

// NOTE: JUST RETURN THE RESPONSE IN JSON FORMAT WITH ONLY A MEANINGFUL TITLE IN AROUND 50 CHARACTERS AND DESCRIPTION IN AROUND 150 WORDS. DO NOT INCLUDE ANY ADDITIONAL INFORMATION, TEXT OR CHARACTERS TO THE JSON OBJECT. JUST THE TITLE AND DESCRIPTION I REPEAT JUST THE TITLE AND DESCRIPTION
// `;
//
//
//
//
//

import { connect } from "@/lib/mongodb/mongoose";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import blogPostModel from "@/lib/models/blogPost.model";

export const helloWorld = inngest.createFunction(
  { id: "bank-statement-converter" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "7s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Blog keywords
const keyWords = [
  "convert bank statement pdf to excel",
  "convert bank statement pdf to excel online",
  "convert bank statement pdf to excel free download",
  "convert pdf bank statement to csv free",
  "convert bank statement pdf to excel sbi",
  "free bank statement converter",
  "bank statement pdf to csv",
  "convert bank statement pdf to excel python",
  "bank statement converter tool",
  "how to convert bank statement pdf to excel in dext",
  "can i convert a pdf bank statement to excel",
  "can you convert pdf bank statement to excel",
  "convert any bank statement pdf to excel",
  "convert kotak bank statement pdf to excel",
  // "how to convert password protected bank statement pdf to excel",
  "how do i convert a pdf bank statement to excel",
  "best way to convert bank statement pdf to excel",
  "convert icici bank statement pdf to excel",
  "how to convert bank statement pdf to excel",
  "converting bank statements to excel",
  "how to convert pdf statement to excel",
  "how to convert bank statement to excel",
];

function getRandomKeyword() {
  return keyWords[Math.floor(Math.random() * keyWords.length)];
}

// Create blog post helper
async function createBlogPost({ title, description }) {
  try {
    await connect();
    const blog = await blogPostModel.create({
      title,
      description,
      createdBy: "system", // Replace with actual user if needed
    });
    return blog;
  } catch (error) {
    console.error("Error saving blog post:", error);
    throw new Error("Failed to create blog post");
  }
}

// Scheduled blog post generation
export const generateBlogPost = inngest.createFunction(
  { name: "Generate blog post" },
  { cron: "0 0,3,6,9,12,15,18,21 * * *" },
  async ({ step }) => {
    const selectedKeyword = getRandomKeyword();

    const prompt = `
You are a professional financial writer.

Write a unique, attention-grabbing blog post title and a short description (about 150 words) focused on this topic: "${selectedKeyword}".

The blog should highlight a powerful bank statement conversion software that:
- Converts bank statements from PDF to Excel or CSV
- Can handle even extremely large files, including thousands of pages
- Helps users analyze financial data with built-in tools for grouping, cleaning, and summarizing
- Saves time and simplifies complex financial workflows

Only return the JSON object in the format below **as the first thing in your response**:

{
  "title": "Your compelling blog title here",
  "description": "A clear and helpful blog description explaining the software's ability to convert large PDF bank statements to Excel/CSV and assist with data analysis, cleaning, and grouping of the converted data."
}

NOTE: JUST RETURN THE RESPONSE IN JSON FORMAT WITH ONLY A MEANINGFUL TITLE IN AROUND 50 CHARACTERS AND DESCRIPTION IN AROUND 150 WORDS. DO NOT INCLUDE ANY ADDITIONAL INFORMATION, TEXT OR CHARACTERS TO THE JSON OBJECT. JUST THE TITLE AND DESCRIPTION I REPEAT JUST THE TITLE AND DESCRIPTION.
`;

    // Request AI response
    const aiRawResponse = await step.ai.wrap("gemini", async () => {
      const result = await geminiModel.generateContent(prompt);
      return await result.response.text();
    });

    console.log("🧪 Raw Gemini Response:", aiRawResponse);

    // Extract only the first valid JSON object
    let jsonMatch = aiRawResponse.match(/\{[\s\S]*?\}/); // Greedy JSON extractor
    let blogPost;

    try {
      if (!jsonMatch) throw new Error("No JSON found in AI response.");
      blogPost = JSON.parse(jsonMatch[0]); // Parse only the JSON part
    } catch (err) {
      console.error("❌ Failed to parse blog post JSON from Gemini:", err);
      blogPost = {
        title: "Invalid response",
        description: "Could not parse blog post content from Gemini AI.",
      };
    }

    // Save the blog post
    await step.run("Create blog post", async () => {
      await createBlogPost({
        title: blogPost.title,
        description: blogPost.description,
      });
    });

    return blogPost;
  }
);
