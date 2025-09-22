// File: /app/api/credit/get/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import User from "@/lib/models/user.model";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    await connect();

    // Fetch only the creditAmount field from the User model
    const user = await User.findOne({ clerkId }).select("creditAmount");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { creditAmount: user.creditAmount },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/credit/get error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
//
//
//
//
//
//
// // app/api/document/get/route.js
// import { NextResponse } from "next/server";
// import { connect } from "@/lib/mongodb/mongoose";
// import User from "@/lib/models/user.model";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const clerkId = searchParams.get("clerkId");

//     if (!clerkId) {
//       return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
//     }

//     await connect();

//     // Fetch only creditAmount
//     const user = await User.findOne({ clerkId }).select("creditAmount");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ creditAmount: user.creditAmount });
//   } catch (error) {
//     console.error("Error fetching credit amount:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
