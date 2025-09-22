import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import documentModel from "@/lib/models/document.model";

// POST: Save document URL and Clerk user ID (sent from frontend)
export async function POST(req) {
  try {
    const { url, clerkUserId } = await req.json();

    console.log(`Clerk-UserId: ${clerkUserId}`.bgGreen);
    console.log(`Cloudinary-Url: ${url}`.bgCyan);

    if (!url || !clerkUserId) {
      return NextResponse.json(
        { error: "Missing url or clerkUserId" },
        { status: 400 }
      );
    }

    await connect();

    const doc = await documentModel.create({
      url,
      clerkUserId,
    });

    return NextResponse.json(
      { message: "Document saved", doc },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


