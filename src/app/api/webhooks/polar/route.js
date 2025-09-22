// import User from "@/lib/models/user.model";
// import { connect } from "@/lib/mongodb/mongoose";
// import PaymentDetail from "@/lib/models/paymentDetail.model";
// import { Webhooks } from "@polar-sh/nextjs";

// export const POST = Webhooks({
//   webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
//   onSubscriptionCreated: async (payload) => {
//     console.log("Subscription Created");
//     console.log(payload);
//   },

//   onSubscriptionActive: async (payload) => {
//     console.log("Subscription Active");
//     console.log(payload);
//   },

//   onSubscriptionCanceled: async (payload) => {
//     console.log("Subscription Canceled");
//     console.log(payload);
//   },

//   onOrderPaid: async (payload) => {
//     console.log("✅ Order Paid Successfully:");
//     console.log(JSON.stringify(payload, null, 2));

//     try {
//       await connect();
//       console.log("⏳ Waiting for DB to fully initialize...");
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       const data = payload.data;

// const amount = data?.total_amount; // Use the full amount paid
// const checkoutId = data?.checkout_id;
// const status = data?.status || "active";
// const callerUserId = data?.customer?.id || data?.user_id;
// const email = data?.customer?.email || data?.user?.email;

//       console.log("📦 Extracted values:", {
//         checkoutId,
//         amount,
//         status,
//         callerUserId,
//         email,
//       });

//       if (!checkoutId || !callerUserId || !amount || !email) {
//         console.error("❌ Missing or invalid data");
//         return;
//       }

//       const existing = await PaymentDetail.findOne({ paymentId: checkoutId });
//       console.log("🔍 Existing payment: ", existing);
//       if (existing) {
//         console.log(`ℹ️ Payment ID ${checkoutId} already exists`);
//         return;
//       }

//       const user = await User.findOne({ email });
//       console.log("👤 Found user:", user);
//       if (!user) {
//         console.error(`❌ No user found with email ${email}`);
//         return;
//       }

//       try {
//         const saved = await PaymentDetail.create({
//           paymentId: checkoutId,
//           amount,
//           status,
//           callerUserId,
//           userId: user._id,
//         });

//         console.log("✅ Successfully saved:", saved);
//       } catch (err) {
//         console.error("❌ Failed to create payment:", err.message, err);
//       }
//     } catch (err) {
//       console.error("❌ General error handling order.paid:", err.message, err);
//     }
//   },
// });
//
//
//
//
//
//
//
//
import User from "@/lib/models/user.model";
import { connect } from "@/lib/mongodb/mongoose";
import PaymentID from "@/lib/models/paymentId.model";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onSubscriptionCreated: async (payload) => {
    console.log("Subscription Created");
    console.log(payload);
  },

  onSubscriptionActive: async (payload) => {
    console.log("Subscription Active");
    console.log(payload);
  },

  onSubscriptionCanceled: async (payload) => {
    console.log("Subscription Canceled");
    console.log(payload);
  },

  // onOrderPaid: async (payload) => {
  //   const totalAmountPaid = payload.data.subscription.amount;
  //   const totalAmountPaidInUSD = totalAmountPaid / 100;
  //   console.log("✅ Order Paid Successfully:");
  //   console.log(`✅ Total Amount Paid: ${payload.data.subscription.amount}`);
  //   console.log(`✅ Total Amount Paid in $ is: ${totalAmountPaidInUSD}`);
  //   console.log(`✅ ${payload.data.subscription.amount}`);
  //   console.log(JSON.stringify("Order Payload: ", payload, null, 2));

  //   try {
  //     await connect();
  //     console.log("⏳ Waiting for DB to fully initialize...");
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     const data = payload.data;

  //     const checkoutId = data?.checkout_id || data?.checkoutId;
  //     const status = data?.status || "active";
  //     const callerUserId = data?.customer?.id || data?.user_id;
  //     const email = data?.customer?.email || data?.user?.email;

  //     console.log("📦 Extracted values:", {
  //       checkoutId,
  //       status,
  //       callerUserId,
  //       email,
  //     });

  //     if (!checkoutId || !callerUserId || !email) {
  //       console.error("❌ Missing required data");
  //       return;
  //     }

  //     const existing = await PaymentID.findOne({ paymentId: checkoutId });
  //     console.log("🔍 Existing payment:", existing);
  //     if (existing) {
  //       console.log(`ℹ️ Payment ID ${checkoutId} already exists`);
  //       return;
  //     }

  //     const user = await User.findOne({ email });
  //     console.log("👤 Found user:", user);
  //     if (!user) {
  //       console.error(`❌ No user found with email ${email}`);
  //       return;
  //     }

  //     try {
  //       const saved = await PaymentID.create({
  //         paymentId: checkoutId,
  //         status,
  //         callerUserId,
  //         userId: user._id,
  //       });

  //       console.log("✅ Successfully saved:", saved);
  //     } catch (err) {
  //       console.error("❌ Failed to create payment:", err.message, err);
  //     }
  //   } catch (err) {
  //     console.error("❌ General error handling order.paid:", err.message, err);
  //   }
  // },

  // Credit mapping in USD → bonus credits

  onOrderPaid: async (payload) => {
    const creditMap = {
      10: 400,
      19: 1000,
      36: 4000,
      76: 500000,
    };

    const totalAmountPaid = payload.data.subscription.amount;
    const totalAmountPaidInUSD = totalAmountPaid / 100;

    console.log("✅ Order Paid Successfully:");
    console.log(`✅ Total Amount Paid (cents): ${totalAmountPaid}`);
    console.log(`✅ Total Amount Paid in USD: ${totalAmountPaidInUSD}`);
    console.log(JSON.stringify("Order Payload: ", payload, null, 2));

    try {
      await connect();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const data = payload.data;

      const checkoutId = data?.checkout_id || data?.checkoutId;
      const status = data?.status || "active";
      const callerUserId = data?.customer?.id || data?.user_id;
      const email = data?.customer?.email || data?.user?.email;

      if (!checkoutId || !callerUserId || !email) {
        console.error("❌ Missing required data");
        return;
      }

      // Prevent duplicate processing
      const existing = await PaymentID.findOne({ paymentId: checkoutId });
      if (existing) {
        console.log(`ℹ️ Payment ID ${checkoutId} already exists`);
        return;
      }

      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        console.error(`❌ No user found with email ${email}`);
        return;
      }

      // Determine credit bonus
      const creditBonus = creditMap[totalAmountPaidInUSD] || 0;

      if (creditBonus > 0) {
        await User.findByIdAndUpdate(user._id, {
          $inc: { creditAmount: creditBonus }, // ✅ Adds to current balance
        });
        console.log(`💳 Added ${creditBonus} credits to ${email}`);
      } else {
        console.log(`⚠️ No credit rule for amount: $${totalAmountPaidInUSD}`);
      }

      // Save payment record
      await PaymentID.create({
        paymentId: checkoutId,
        status,
        callerUserId,
        userId: user._id,
      });

      console.log("✅ Payment processed successfully");
    } catch (err) {
      console.error("❌ Error handling order.paid:", err.message, err);
    }
  },
});
