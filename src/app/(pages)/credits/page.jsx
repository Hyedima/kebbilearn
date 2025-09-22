"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CreditUsagePage() {
  const { user, isLoaded } = useUser();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCreditUsage = async () => {
      if (!isLoaded || !user?.id) return; // Wait for Clerk to load

      try {
        const res = await fetch(`/api/credit/get?clerkId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch credit usage");

        const data = await res.json();

        // If API returns [{ creditAmount: 11 }]
        if (Array.isArray(data) && data.length > 0) {
          setCredit(data[0].creditAmount);
        } else if (data?.creditAmount !== undefined) {
          // If API returns { creditAmount: 11 }
          setCredit(data.creditAmount);
        } else {
          setCredit(0);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCreditUsage();
  }, [isLoaded, user]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <section className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Credit Usage</h1>
        <p className="text-gray-600 mb-6">
          Track how many credits you have left.
        </p>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-1/4">
            <Loader
              className="animate-spin text-indigo-600"
              style={{ width: 40, height: 40 }}
            />
            <p className="font-bold text-3xl"> Loading...Please wait</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg shadow-sm bg-indigo-50 text-center">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">
                Available Credits
              </h2>
              <p className="text-3xl font-bold text-indigo-700">
                {credit ?? 0}
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
