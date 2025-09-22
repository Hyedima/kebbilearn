// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { CheckCircle } from "lucide-react";
// import Link from "next/link";

// export default function Success() {
//   const searchParams = useSearchParams();
//   const [checkoutId, setCheckoutId] = useState(null);

//   useEffect(() => {
//     const id = searchParams.get("checkoutId");
//     setCheckoutId(id);
//   }, [searchParams]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4">
//       <div className="max-w-md w-full text-center bg-white shadow-lg rounded-2xl p-8">
//         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//         <h1 className="text-2xl font-bold text-green-600 mb-2">
//           Payment Successful!
//         </h1>
//         <p className="text-gray-600 mb-4">
//           Thank you for your payment. Your checkout ID is:
//         </p>
//         {checkoutId ? (
//           <code className="block bg-gray-100 text-sm text-gray-800 p-2 rounded mb-4 break-words">
//             {checkoutId}
//           </code>
//         ) : (
//           <p className="text-sm text-gray-400">Fetching transaction ID...</p>
//         )}
//         <Link
//           href="/"
//           className="inline-block mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-all"
//         >
//           Go Back Home
//         </Link>
//       </div>
//     </div>
//   );
// }
// 
// 
// 
// 
// 
// 
// 
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [checkoutId, setCheckoutId] = useState(null);

  useEffect(() => {
    const id = searchParams.get("checkoutId");
    setCheckoutId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 px-4">
      <div className="max-w-md w-full text-center bg-white shadow-lg rounded-2xl p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. Your checkout ID is:
        </p>
        {checkoutId ? (
          <code className="block bg-gray-100 text-sm text-gray-800 p-2 rounded mb-4 break-words">
            {checkoutId}
          </code>
        ) : (
          <p className="text-sm text-gray-400">Fetching transaction ID...</p>
        )}
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-all"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    //Added Suspense For smooth deployment
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
