import User from "../models/user.model";

import { connect } from "../mongodb/mongoose";

await connect(); // ensure this is high enough to initialize early

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses
) => {
  try {
    await connect();

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      console.log("❌ No email found in email_addresses:", email_addresses);
      return null;
    }

    console.log("🔧 Upserting user to DB...");

    // const user = await User.findOneAndUpdate(
    //   { clerkId: id },
    //   {
    //     $set: {
    //       firstName: first_name,
    //       lastName: last_name,
    //       profilePicture: image_url,
    //       email,
    //     },
    //   },
    //   { upsert: true, new: true }
    // );

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $setOnInsert: { creditAmount: 11 }, // only sets on creation
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ User upserted:", user);
    return user;
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error);
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log("Error: Could not delete user:", error);
  }
};
