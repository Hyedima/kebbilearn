import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});
//
//
//
//I will uncomment the remaining part of the code to respond
// Even though this one is working and it should be working okay and fine if not for some little changes

//
// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// Model instance
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Generation config (no responseMimeType)
// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
// };

// Function to generate text
// export const chatSession = model.startChat({
//   generationConfig,
//   history: [],
// });

// Function to generate images
export const generateImage = async (prompt) => {
  try {
    const imageModel = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-vision",
    });

    const response = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const imageUrl = response.candidates[0]?.content.parts[0]?.text;

    if (!imageUrl) throw new Error("No image URL returned");

    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
