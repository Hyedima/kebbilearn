import { api } from "@/lib/polar";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { productId } = params;

  try {
    const productsRes = await api.products.list({ isArchived: false });
    const product = productsRes?.result?.items?.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
//
//
//
//
//
//
// import { api } from "@/lib/polar";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const productId = params

//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const productsRes = await api.products.list({ isArchived: false });
//     const product = productsRes?.result?.items?.find((p) => p.id === productId);

//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error("Failed to fetch product:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
