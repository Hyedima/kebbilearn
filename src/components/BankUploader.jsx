// "use client";

// import { useState, useCallback } from "react";
// import { SignedIn, SignedOut } from "@clerk/nextjs";
// import Link from "next/link";
// import { useDropzone } from "react-dropzone";
// import axios from "axios";
// import { chatSession } from "@/utils/AiModel";
// import * as XLSX from "xlsx";
// import { Loader } from "lucide-react";

// const BankUploader = () => {
//   const [file, setFile] = useState(null);
//   const [tableData, setTableData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const onDrop = useCallback((acceptedFiles) => {
//     if (acceptedFiles.length > 0) {
//       setFile(acceptedFiles[0]);
//       setTableData([]);
//       setColumns([]);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: false,
//     accept: {
//       "application/pdf": [".pdf"],
//     },
//   });

//   const handleUpload = async () => {
//     if (!file) return alert("Please select or drop a PDF file first.");
//     setIsProcessing(true);
//     setTableData([]);
//     setColumns([]);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post("/api/upload-statement", formData);
//       const { chunks } = res.data;

//       if (!chunks?.length) {
//         alert("No valid content found.");
//         return;
//       }

//       for (let i = 0; i < chunks.length; i++) {
//         const chunkText = chunks[i];
//         const chunkData = await processChunkWithGemini(chunkText, i);

//         if (Array.isArray(chunkData) && chunkData.length) {
//           setTableData((prev) => [...prev, ...chunkData]);
//           if (columns.length === 0) {
//             setColumns(Object.keys(chunkData[0]));
//           }
//         } else {
//           console.warn(`Chunk ${i + 1} returned no data.`);
//         }
//       }
//     } catch (err) {
//       console.error("Upload failed:", err.response?.data || err.message);
//       alert("Failed to process the PDF.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const processChunkWithGemini = async (chunkText, index) => {
//     try {
//       const prompt = `
// You are a professional bank statement parser.

// Your task is to extract all transaction records from the following raw bank statement text.

// **IMPORTANT INSTRUCTIONS:**
// - Reconstruct the transaction table exactly as it appears in the original document.
// - Preserve the correct column titles exactly as shown in the statement (e.g., Date, Description, Amount, Balance, etc.).
// - Even if the formatting is irregular or noisy, extract the accurate table structure and transaction data.
// - Return only a valid JSON array of objects, with each object representing a row of the table.
// - If no transactions are present, return: []
// - Do NOT include any markdown, explanations, commentary, or additional text.

// Here is the raw bank statement text:
// """
// ${chunkText}
// """`;

//       const aiResult = await chatSession.sendMessage(prompt);
//       const aiResponse = await aiResult.response.text();

//       const cleaned = aiResponse.replace(/```json|```/g, "").trim();

//       try {
//         const parsed = JSON.parse(cleaned);
//         return Array.isArray(parsed) ? parsed : [];
//       } catch (jsonErr) {
//         console.warn(`JSON parsing failed on chunk ${index + 1}`);
//         return [];
//       }
//     } catch (err) {
//       console.error(`Gemini failed on chunk ${index + 1}:`, err);
//       return [];
//     }
//   };

//   const handleDownload = (format) => {
//     if (!tableData.length) return;

//     const ws = XLSX.utils.json_to_sheet(tableData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Statement");

//     if (format === "csv") {
//       XLSX.writeFile(wb, "bank_statement.csv", { bookType: "csv" });
//     } else {
//       XLSX.writeFile(wb, "bank_statement.xlsx", { bookType: "xlsx" });
//     }
//   };

//   return (
//     <div className="space-y-4 p-4">
//       <SignedIn>
//         <h2 className="text-lg font-semibold text-center">
//           Upload Bank Statement (.pdf)
//         </h2>

//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition ${
//             isDragActive ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {file ? (
//             <p className="text-gray-700 font-medium">
//               Selected File: {file.name}
//             </p>
//           ) : isDragActive ? (
//             <p className="text-indigo-600 font-medium">
//               Drop the file here ...
//             </p>
//           ) : (
//             <p className="text-gray-500">
//               Drag and drop a PDF file here, or click to select
//             </p>
//           )}
//         </div>

//         <button
//           onClick={handleUpload}
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
//           disabled={isProcessing}
//         >
//           {isProcessing ? (
//             <div className="flex flex-col justify-center items-center">
//               <Loader
//                 className={`animate-spin text-white`}
//                 style={{ width: 25, height: 25 }}
//               />
//             </div>
//           ) : (
//             "Upload & Analyze"
//           )}
//         </button>

//         {tableData.length > 0 && (
//           <div className="mt-6 bg-gray-100 p-4 rounded space-y-4">
//             <div className="flex gap-4 mt-4">
//               <button
//                 onClick={() => handleDownload("xlsx")}
//                 className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//               >
//                 Download Excel
//               </button>
//               <button
//                 onClick={() => handleDownload("csv")}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//               >
//                 Download CSV
//               </button>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">
//               Full Statement & Analysis
//             </h3>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     {columns.map((col, i) => (
//                       <th key={i} className="py-2 px-4 text-left">
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tableData.map((row, i) => (
//                     <tr key={i} className="border-b">
//                       {columns.map((col, j) => (
//                         <td key={j} className="py-2 px-4">
//                           {row[col] || ""}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </SignedIn>

//       <SignedOut>
//         <div className="text-center border rounded-lg bg-gray-50 p-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4">
//             Please{" "}
//             <Link href="/sign-in" className="text-indigo-600 underline">
//               sign in
//             </Link>{" "}
//             or{" "}
//             <Link href="/sign-up" className="text-indigo-600 underline">
//               sign up
//             </Link>{" "}
//             to start converting your PDF.
//           </h2>
//         </div>
//       </SignedOut>
//     </div>
//   );
// };

// export default BankUploader;
//
//
//
//
//
//
//
//
//
"use client";

import { useState, useCallback } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { chatSession } from "@/utils/AiModel";
import * as XLSX from "xlsx";
import { Loader } from "lucide-react";

const BankUploader = () => {
  const [file, setFile] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("bank_statement");
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { user, isLoaded, isSignedIn } = useUser();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setOriginalFileName(selectedFile.name.replace(/\.[^/.]+$/, "")); // remove extension
      setTableData([]);
      setColumns([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const uploadToCloudinary = async (fileBlob, fileName, fileType) => {
    const formData = new FormData();
    formData.append("file", fileBlob, fileName);
    formData.append("upload_preset", "your_unsigned_preset"); // replace this
    formData.append("resource_type", "raw");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/<your-cloud-name>/raw/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log(`✅ Uploaded ${fileType} to Cloudinary:`, data.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error(`❌ Cloudinary upload failed for ${fileType}:`, err);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select or drop a PDF file first.");
    setIsProcessing(true);
    setTableData([]);
    setColumns([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/upload-statement", formData);
      const { chunks } = res.data;

      if (!chunks?.length) {
        alert("No valid content found.");
        return;
      }

      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i];
        const chunkData = await processChunkWithGemini(chunkText, i);

        if (Array.isArray(chunkData) && chunkData.length) {
          setTableData((prev) => [...prev, ...chunkData]);
          if (columns.length === 0) {
            setColumns(Object.keys(chunkData[0]));
          }
        } else {
          console.warn(`Chunk ${i + 1} returned no data.`);
        }
      }
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Failed to process the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processChunkWithGemini = async (chunkText, index) => {
    try {
      const prompt = `
You are a professional bank statement parser.

Your task is to extract all transaction records from the following raw bank statement text.

**IMPORTANT INSTRUCTIONS:**
- Reconstruct the transaction table exactly as it appears in the original document.
- Preserve the correct column titles exactly as shown in the statement (e.g., Date, Description, Amount, Balance, etc.).
- Even if the formatting is irregular or noisy, extract the accurate table structure and transaction data.
- Return only a valid JSON array of objects, with each object representing a row of the table.
- If no transactions are present, return: []
- Do NOT include any markdown, explanations, commentary, or additional text.

Here is the raw bank statement text:
"""
${chunkText}
"""`;

      const aiResult = await chatSession.sendMessage(prompt);
      const aiResponse = await aiResult.response.text();

      const cleaned = aiResponse.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
      } catch (jsonErr) {
        console.warn(`JSON parsing failed on chunk ${index + 1}`);
        return [];
      }
    } catch (err) {
      console.error(`Gemini failed on chunk ${index + 1}:`, err);
      return [];
    }
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i);
    return buf;
  };

  const handleDownload = async (format) => {
    if (!tableData.length || !file) return;

    const userId = user?.id;

    if (!userId) {
      console.error("No Clerk user ID found.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statement");

    const baseName = file.name.replace(/\.[^/.]+$/, ""); // Remove .pdf
    let blob, fileType, fileExt;

    if (format === "csv") {
      const csvStr = XLSX.write(wb, { bookType: "csv", type: "string" });
      blob = new Blob([csvStr], { type: "text/csv" });
      fileType = "text/csv";
      fileExt = "csv";
    } else {
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      fileExt = "xlsx";
    }

    const fileName = `${baseName}.${fileExt}`;

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // Upload to Cloudinary
    const uploadedUrl = await uploadToCloudinary(blob, fileName);

    // Save to backend with userId and uploaded file URL
    if (uploadedUrl && userId) {
      try {
        console.log(`Clerk-UserId to be saved: ${userId}`);
        const res = await fetch("/api/save-document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: uploadedUrl, clerkUserId: userId }),
        });

        if (!res.ok) {
          throw new Error("Failed to save document to database");
        }
      } catch (err) {
        console.error("Failed to save document in DB:", err);
      }
    }
  };

  return (
    <div className="space-y-4 p-4">
      <SignedIn>
        <h2 className="text-lg font-semibold text-center">
          Upload Bank Statement (.pdf)
        </h2>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition ${
            isDragActive ? "border-indigo-600 bg-indigo-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="text-gray-700 font-medium">
              Selected File: {file.name}
            </p>
          ) : isDragActive ? (
            <p className="text-indigo-600 font-medium">
              Drop the file here ...
            </p>
          ) : (
            <p className="text-gray-500">
              Drag and drop a PDF file here, or click to select
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex flex-col justify-center items-center">
              <Loader
                className="animate-spin text-white"
                style={{ width: 25, height: 25 }}
              />
            </div>
          ) : (
            "Upload & Analyze"
          )}
        </button>

        {tableData.length > 0 && (
          <div className="mt-6 bg-gray-100 p-4 rounded space-y-4">
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleDownload("xlsx")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Download Excel
              </button>
              <button
                onClick={() => handleDownload("csv")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Download CSV
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Full Statement & Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    {columns.map((col, i) => (
                      <th key={i} className="py-2 px-4 text-left">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i} className="border-b">
                      {columns.map((col, j) => (
                        <td key={j} className="py-2 px-4">
                          {row[col] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div className="text-center border rounded-lg bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Please{" "}
            <Link href="/sign-in" className="text-indigo-600 underline">
              sign in
            </Link>{" "}
            or{" "}
            <Link href="/sign-up" className="text-indigo-600 underline">
              sign up
            </Link>{" "}
            to start converting your PDF.
          </h2>
        </div>
      </SignedOut>
    </div>
  );
};

export default BankUploader;
