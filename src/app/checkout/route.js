import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: process.env.SUCCESS_URL,
  server: "sandbox",
});

// import { Checkout } from "@polar-sh/nextjs";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const products = searchParams.get("products");
//   const customerEmail = searchParams.get("customerEmail");

//   if (!products || !customerEmail) {
//     return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
//   }

//   const checkoutSession = await Checkout({
//     accessToken: process.env.POLAR_ACCESS_TOKEN,
//     successUrl: process.env.SUCCESS_URL,
//     server: "sandbox",
//   });

//   // Get session URL from Polar
//   const session = await checkoutSession.create({
//     products: [products],
//     customerEmail,
//   });

//   const acceptHeader = request.headers.get("accept") || "";

//   // If the request came from a fetch expecting JSON
//   if (acceptHeader.includes("application/json")) {
//     return NextResponse.json({ url: session.url });
//   }

//   // Default: redirect the browser
//   return NextResponse.redirect(session.url);
// }
