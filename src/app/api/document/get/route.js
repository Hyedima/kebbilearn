import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import documentModel from "@/lib/models/document.model";

// ✅ GET: Fetch documents for a specific user
// export async function GET(req) {
//   try {
//     // Parse query params (e.g., /api/document?clerkUserId=abc123)
//     const { searchParams } = new URL(req.url);
//     const clerkUserId = searchParams.get("clerkUserId");

//     if (!clerkUserId) {
//       return NextResponse.json(
//         { error: "Missing clerkUserId in query params" },
//         { status: 400 }
//       );
//     }

//     await connect();

//     const docs = await documentModel
//       .find({ clerkUserId })
//       .sort({ createdAt: -1 });

//     return NextResponse.json(docs, { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkUserId = searchParams.get("clerkUserId");

    console.log("DEBUG clerkUserId:", clerkUserId);
    console.log("DEBUG MONGODB_URI exists:", !!process.env.MONGODB_URI);

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Missing clerkUserId" },
        { status: 400 }
      );
    }

    await connect();
    const docs = await documentModel
      .find({ clerkUserId })
      .sort({ createdAt: -1 });

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: Save document (your existing code)
// export async function POST(req) {
//   try {
//     const { url, clerkUserId } = await req.json();

//     if (!url || !clerkUserId) {
//       return NextResponse.json(
//         { error: "Missing url or clerkUserId" },
//         { status: 400 }
//       );
//     }

//     await connect();

//     const doc = await documentModel.create({
//       url,
//       clerkUserId,
//     });

//     return NextResponse.json(
//       { message: "Document saved", doc },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
