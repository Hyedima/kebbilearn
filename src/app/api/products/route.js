import { api } from "@/lib/polar";

export async function GET() {
  try {
    const products = await api.products.list({ isArchived: false });
    return Response.json(products.result.items || []);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return Response.json([], { status: 500 });
  }
}


