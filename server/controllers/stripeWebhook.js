const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const User = require("../models/User");
const Course = require("../models/Course");

exports.stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    console.log("🔥 Stripe webhook endpoint HIT");
      console.log("Headers:", req.headers);
     console.log("Raw Body:", req.rawBody?.toString());


    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET   // we will generate this in dashboard
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ⚡ Payment Successful Event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        console.log("⚡ Webhook triggered successfully!");
        console.log("➡ Metadata:", session.metadata);
        // courseId and userId were sent using metadata
        const courseId = session.metadata.courseId;
        const userId = session.metadata.userId;

        try {
            // Enroll user in course
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { enrolledCourses: courseId } }
            );

            await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } }
            );

            console.log("✅ User enrolled successfully!");
        } catch (error) {
            console.error("DB update error:", error);
        }
    }

    res.status(200).send("OK");
};
