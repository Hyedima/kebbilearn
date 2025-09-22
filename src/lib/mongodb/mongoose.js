// import mongoose from "mongoose";
// import "colors";

// let initialized = false;

// export const connect = async () => {
//   mongoose.set("strictQuery", true);

//   if (initialized) {
//     console.log("✅ MongoDB connected".white.bgGreen.bold);
//     return;
//   }

//   try {
//     if (!process.env.MONGODB_URI) {
//       throw new Error("❌ MONGODB_URI not defined in environment variables");
//     }

//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "bank-statement-converter",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     initialized = true;
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.log("MongoDB connection error:", error);
//   }
// };
//
//
//
//
//

// import mongoose from "mongoose";

// let isConnected = false; // track connection

// export async function connect() {
//   if (isConnected) {
//     console.log("✅ MongoDB already connected");
//     return;
//   }

//   if (!process.env.MONGODB_URI) {
//     throw new Error("❌ MONGODB_URI not defined in .env.local");
//   }

//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "bank-statement-converter",
//     });

//     isConnected = true;
//     console.log(`✅ MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     throw error;
//   }
// }
