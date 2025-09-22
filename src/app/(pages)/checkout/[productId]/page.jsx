"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Loader } from "lucide-react";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { productId } = useParams();
  const customerEmail = searchParams.get("customerEmail");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePayment = () => {
    const url = `/api/checkout?products=${productId}&customerEmail=${encodeURIComponent(
      customerEmail
    )}`;
    window.location.href = url;
  };

  if (loading)
    return (
      //
      <div className="flex flex-col justify-center items-center h-1/4">
        {/* <Loader className={`animate-spin text-indigo-600`} style={{ width: 40, height: 40 }} /> */}
        <Loader
          className={`animate-spin text-indigo-600`}
          style={{ width: 40, height: 40 }}
        />
        <p className="font-bold text-3xl"> Loading...Please wait</p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Product not found.
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Complete Your Purchase
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {product.name}
          </h2>
          <p className="text-4xl font-bold text-indigo-600 mb-2">
            ${(Number(product.prices?.[0]?.priceAmount) / 100).toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        </div>

        <div className="mb-6 bg-gray-100 p-3 rounded">
          <p className="text-gray-700 text-sm">Purchasing as:</p>
          <p className="text-gray-800 font-medium">{customerEmail}</p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md text-lg font-medium transition"
        >
          Proceed to Secure Payment
        </button>
      </div>
    </main>
  );
}
