"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function PDFConvertComponent() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(""); // For success or info messages
  const [error, setError] = useState("");     // For error messages

  const onDrop = useCallback((acceptedFiles) => {
    // Clear previous messages on new file drop
    setMessage("");
    setError("");
    setUrl("");

    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      if (droppedFile.type !== "application/pdf") {
        setError("Please drop a PDF file. Other file types are not supported.");
        setFile(null); // Clear invalid file
      } else {
        setFile(droppedFile);
        setMessage(`📄 ${droppedFile.name} selected. Click 'Convert Now' to proceed.`);
      }
    }
  }, []);

  const convertFile = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }
    
    setMessage("Starting conversion...");
    setError(""); // Clear previous errors
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // Attempt to parse JSON error message from server
        const errorData = await res.json().catch(() => ({ error: "Unknown server error" }));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      setUrl(downloadUrl);
      setMessage("✅ Conversion successful!");
    } catch (err) {
      console.error("Client error:", err);
      setError(`Conversion failed: ${err.message}. Please try again.`);
      setUrl(""); // Clear download URL on error
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: { 'application/pdf': ['.pdf'] } });

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full p-4 sm:p-6 md:p-8 font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">PDF to Excel Converter</h1>
      
      <div
        {...getRootProps()}
        className={`w-full max-w-md border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out cursor-pointer
          ${isDragActive ? "border-indigo-600 bg-indigo-50 shadow-lg" : "border-gray-300 bg-white hover:bg-gray-50"}
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 text-lg">
          {file ? (
            <span className="text-green-600 font-semibold flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {file.name}
            </span>
          ) : isDragActive ? (
            <span className="text-indigo-600 font-semibold">Drop your PDF here...</span>
          ) : (
            <>
              Drag & drop a <span className="text-indigo-600 font-semibold underline">PDF file</span> here, or{" "}
              <span className="text-indigo-600 font-semibold underline">click to select</span>
            </>
          )}
        </p>
      </div>

      <button
        onClick={convertFile}
        disabled={!file || uploading}
        className={`px-8 py-4 rounded-xl shadow-md text-white text-lg font-bold transition-all duration-300 ease-in-out
          ${uploading || !file
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        {uploading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Converting...
          </span>
        ) : (
          "Convert Now"
        )}
      </button>

      {/* Display messages and errors */}
      {message && !error && (
        <p className="mt-4 text-green-700 bg-green-100 p-3 rounded-md w-full max-w-md text-center">{message}</p>
      )}

      {error && (
        <p className="mt-4 text-red-700 bg-red-100 p-3 rounded-md w-full max-w-md text-center font-medium">{error}</p>
      )}

      {url && (
        <p className="mt-4 text-blue-600 text-lg bg-blue-50 p-4 rounded-md shadow w-full max-w-md text-center">
          ✅ Download your Excel file:{" "}
          <a href={url} download="converted.xlsx" className="underline font-semibold hover:text-blue-800 transition-colors">
            Click here
          </a>
        </p>
      )}
    </div>
  );
}
