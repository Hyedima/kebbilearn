// "use client";

// import Link from "next/link";

// export default function PricingPage() {
//   const plans = [
//     {
//       title: "Starter",
//       price: "$10 / month",
//       pages: "400 pages / month",
//       cta: "Buy",
//       link: "/subscribe?plan=starter",
//     },
//     {
//       title: "Professional",
//       price: "$19 / month",
//       pages: "1000 pages / month",
//       cta: "Buy",
//       link: "/subscribe?plan=professional",
//     },
//     {
//       title: "Business",
//       price: "$36 / month",
//       pages: "4000 pages / month",
//       cta: "Buy",
//       link: "/subscribe?plan=business",
//     },
//     {
//       title: "Unlimited Business",
//       price: "$76 / month",
//       pages: "Unlimited pages / month",
//       cta: "Buy",
//       link: "/subscribe?plan=unlimited",
//     },
//     // {
//     //   title: "Enterprise",
//     //   price: "Need More?",
//     //   pages: "",
//     //   cta: "Contact",
//     //   link: "/contact",
//     // },
//   ];

//   return (
//     <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
//       <section className="max-w-5xl mx-auto text-center mb-16">
//         <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
//         <p className="text-gray-600 text-lg">
//           Choose the right plan based on your document volume needs.
//         </p>
//       </section>

//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
//         {plans.map((plan, index) => (
//           <div
//             key={index}
//             className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
//           >
//             <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
//             <p className="text-3xl font-bold text-indigo-600 mb-4">
//               {plan.price}
//             </p>
//             {plan.pages && (
//               <p className="text-gray-600 text-sm mb-6">{plan.pages}</p>
//             )}
//             <Link
//               href={plan.link}
//               className={`inline-block ${
//                 plan.title === "Enterprise"
//                   ? "bg-gray-600 hover:bg-gray-700"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               } text-white px-6 py-2 rounded-md text-sm font-medium transition`}
//             >
//               {plan.cta}
//             </Link>
//           </div>
//         ))}
//       </section>
//     </main>
//   );
// }

//
//
//
//
//
//
"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductList() {
  const { isSignedIn, user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const customerEmail = isSignedIn
    ? user?.primaryEmailAddress?.emailAddress || ""
    : "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-gray-600 text-lg">
          Choose the right plan based on your document volume needs.
        </p>
      </section>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-1/4">
          {/* <Loader className={`animate-spin text-indigo-600`} style={{ width: 40, height: 40 }} /> */}
          <Loader
            className={`animate-spin text-indigo-600`}
            style={{ width: 40, height: 40 }}
          />
          <p className="font-bold text-3xl"> Loading...Please wait</p>
        </div>
      ) : products?.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <p className="text-3xl font-bold text-indigo-600 mb-4">
                ${product.prices?.[0]?.priceAmount / 100}
              </p>
              {product.description && (
                <p className="text-gray-600 text-sm mb-6">
                  {product.description}
                </p>
              )}
              <Link
                href={`/checkout/${
                  product.id
                }?customerEmail=${encodeURIComponent(customerEmail)}`}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition"
              >
                Subscribe
              </Link>
            </div>
          ))}
        </section>
      ) : (
        <div className="text-center col-span-full text-red-500">
          No products available right now.
        </div>
      )}
    </main>
  );
}

//
//
//
//
//
// "use client";

// import { useUser } from "@clerk/nextjs";

// export default function UserSection() {
//   const { isSignedIn, user } = useUser();

//   if (!isSignedIn) {
//     return <div>Please sign in to view your details.</div>;
//   }

//   return (
//     <div>
//       <p>Welcome {user.fullName}</p>
//       <p>Your email is {user.primaryEmailAddress.emailAddress}</p>
//     </div>
//   );
// }
