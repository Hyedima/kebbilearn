// // File: /app/api/credit/put/route.js
// import { NextResponse } from "next/server";
// import { connect } from "@/lib/mongodb/mongoose";
// import User from "@/lib/models/user.model"; // using the User model

// export async function PUT(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const clerkId = searchParams.get("clerkId");
//     const { creditAmount } = await req.json();

//     if (!clerkId || typeof creditAmount !== "number") {
//       return NextResponse.json(
//         { error: "Missing or invalid clerkId or creditAmount" },
//         { status: 400 }
//       );
//     }

//     await connect();

//     // Update user's creditAmount
//     const updatedUser = await User.findOneAndUpdate(
//       { clerkId },
//       { creditAmount },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         message: "Credit updated successfully",
//         creditAmount: updatedUser.creditAmount,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("PUT /api/credit/put error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
//
//
//
//
//
//
//
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import User from "@/lib/models/user.model";
import "colors";

// PUT: Deduct credits by pageCount for a given Clerk user
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const { pageCount } = await req.json();

    console.log(`Clerk ID: ${clerkId}`.bgGreen);
    console.log(`Page Count to Deduct: ${pageCount}`.bgCyan);

    if (!clerkId || typeof pageCount !== "number" || pageCount <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid clerkId or pageCount" },
        { status: 400 }
      );
    }

    await connect();

    // Find user and check credits
    const user = await User.findOne({ clerkId }).select("creditAmount");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.creditAmount < pageCount) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // Deduct credits
    user.creditAmount -= pageCount;
    await user.save();

    return NextResponse.json(
      {
        message: "Credits deducted successfully",
        creditAmount: user.creditAmount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
