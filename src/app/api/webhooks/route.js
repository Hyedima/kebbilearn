import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { users } from "@clerk/clerk-sdk-node";

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error: Verification error", { status: 400 });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { first_name, last_name, image_url, email_addresses } = evt?.data;

    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );

      console.log("✅ Mongo user created/updated:", user);

      if (user && user._id && eventType === "user.created") {
        const mongoId = user._id.toString();
        console.log(
          `🔁 Attempting to attach userMongoId: ${mongoId} to Clerk user ${id}`
        );

        try {
          const updated = await users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: mongoId,
            },
          });

          console.log("✅ Clerk metadata updated:", updated.publicMetadata);
        } catch (error) {
          console.error(
            "❌ Error updating Clerk metadata:",
            error?.response?.data || error.message || error
          );
        }
      } else {
        console.warn("⚠️ Skipped Clerk metadata update - missing user or _id");
      }
    } catch (error) {
      console.error("❌ Error in createOrUpdateUser:", error);
      return new Response("Error: Could not create or update user", {
        status: 400,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      return new Response("Error: Could not delete user", { status: 400 });
    }
  }

  return new Response("✅ Webhook received", { status: 200 });
}
