"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader, Download, Trash2 } from "lucide-react";

const DocumentsPage = () => {
  const { user, isLoaded } = useUser();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch documents for this specific user
  const fetchDocuments = async () => {
    if (!isLoaded || !user?.id) return;

    try {
      const response = await fetch(`/api/document/get?clerkUserId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        // Your API returns docs array directly
        setDocuments(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch documents:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [isLoaded, user]);

  // Delete a document
  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    console.log(`ID OF THE DOCUMENT TO BE DELETED::: ${docId}`);

    try {
      const res = await fetch(
        `/api/document/delete/${encodeURIComponent(docId)}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc._id !== docId));
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Download a document
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "document"; // tries to keep original filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Uploaded Documents</h1>

      {!isLoaded || loading ? (
        <div className="flex flex-col justify-center items-center h-1/4">
          <Loader
            className="animate-spin text-indigo-600"
            style={{ width: 40, height: 40 }}
          />
          <p className="font-bold text-3xl"> Loading... Please wait</p>
        </div>
      ) : documents.length === 0 ? (
        <p className="text-gray-500">No documents found.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => {
            // Extract file name from the URL
            // const fileName = decodeURIComponent(doc.url.split("/").pop());
            const fileName = decodeURIComponent(doc.name);

            return (
              <li
                key={doc._id}
                className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <span className="text-blue-600 font-medium break-all">
                    {fileName}
                  </span>
                  <p className="text-sm text-gray-500">
                    Uploaded on: {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(doc.url)}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DocumentsPage;
