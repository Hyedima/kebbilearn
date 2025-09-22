// import { NextResponse } from "next/server";
// import { connect } from "@/lib/mongodb/mongoose";
// import documentModel from "@/lib/models/document.model";

// // ✅ DELETE: Remove a document by ID
// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing document ID in query params" },
//         { status: 400 }
//       );
//     }

//     await connect();

//     const deletedDoc = await documentModel.findByIdAndDelete(id);

//     if (!deletedDoc) {
//       return NextResponse.json(
//         { error: "Document not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Document deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("DELETE error:", error);
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
import documentModel from "@/lib/models/document.model";

// ✅ DELETE: Remove a document by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing document ID" },
        { status: 400 }
      );
    }

    await connect();

    const deletedDoc = await documentModel.findByIdAndDelete(id);

    if (!deletedDoc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
