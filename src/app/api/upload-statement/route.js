// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import path from "path";
// import os from "os";
// import pdfParse from "pdf-parse";

// export async function POST(req) {
//   const formData = await req.formData();
//   const file = formData.get("file");

//   if (!file || !file.name.endsWith(".pdf")) {
//     return NextResponse.json(
//       { error: "Please upload a PDF file." },
//       { status: 400 }
//     );
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const tempPath = path.join(os.tmpdir(), file.name);
//   await writeFile(tempPath, buffer);

//   try {
//     const data = await pdfParse(buffer);
//     const fullText = data.text;

//     // Split into lines
//     const lines = fullText
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line.length > 0);

//     // Assume ~45 lines per page (adjust if needed)
//     const linesPerPage = 45;
//     const pages = [];
//     for (let i = 0; i < lines.length; i += linesPerPage) {
//       const pageText = lines.slice(i, i + linesPerPage).join("\n");
//       pages.push(pageText);
//     }

//     // Group every 3 pages into 1 chunk
//     const chunkSize = 3;
//     const chunks = [];
//     for (let i = 0; i < pages.length; i += chunkSize) {
//       chunks.push(pages.slice(i, i + chunkSize).join("\n\n"));
//     }

//     return NextResponse.json({
//       message: "Successfully chunked",
//       totalPages: pages.length,
//       totalChunks: chunks.length,
//       chunks,
//     });
//   } catch (error) {
//     console.error("PDF parsing or chunking failed:", error);
//     return NextResponse.json(
//       { error: "Failed to parse and chunk the PDF." },
//       { status: 500 }
//     );
//   }
// }
