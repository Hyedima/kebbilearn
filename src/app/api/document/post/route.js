import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import documentModel from "@/lib/models/document.model";
import "colors";

// POST: Save document URL, name, and Clerk user ID
export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    console.log("📥 Request Body:", body);

    const newDocument = await documentModel.create({
      url: body.url,
      clerkUserId: body.clerkUserId,
      name: body.name,
    });

    console.log("✅ Document Saved:", newDocument);

    return NextResponse.json(
      { success: true, data: newDocument },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving document:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
