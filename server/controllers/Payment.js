const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const mailSender = require('../utils/mailSender');

const User = require("../models/User");
const Course = require("../models/Course");

exports.createStripeSession = async (req, res) => {
  try {
    console.log("createStripeSession called");
    // Basic validations
    const { courseName, price, courseId } = req.body;
    const userId = req.user && req.user.id;

    console.log("Incoming body:", { courseName, price, courseId, userId });

    if (!userId) {
      console.error("Auth error: req.user not found");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!courseId || !courseName || typeof price === "undefined") {
      console.error("Validation error: missing fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: courseId, courseName, price",
      });
    }

    // Ensure price is a number
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      console.error("Validation error: invalid price", price);
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    // ensure FRONTEND_URL exists
    if (!process.env.FRONTEND_URL) {
      console.error("Missing FRONTEND_URL env var");
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }

    const user = await User.findById(userId);

    if (user.enrolledCourses.map(id => id.toString()).includes(courseId)) {
  return res.status(400).json({
    success: false,
    message: "You are already enrolled in this course.",
  });
}


    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: courseName },
            unit_amount: Math.round(numericPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
success_url: `${process.env.FRONTEND_URL}/dashboard/enrolled-courses?courses=${encodeURIComponent(
  JSON.stringify([courseId])
)}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: { courseId, userId },
    });

    console.log("Stripe session created:", session.id);
    return res.json({ success: true, url: session.url });
  } catch (err) {
    // log full error server-side
    console.error("Stripe error (createStripeSession):", err);

    // return useful message for debugging (remove in production)
    const message = err?.raw?.message || err.message || "Stripe session error";
    return res.status(500).json({ success: false, message });
  }
};

exports.createStripeSessionMultiple = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courses } = req.body; // [{courseId, name, price}]

    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses provided",
      });
    }

    // Line items for Stripe
    const line_items = courses.map((course) => ({
      price_data: {
        currency: "inr",
        product_data: { name: course.name },
        unit_amount: Math.round(Number(course.price) * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/dashboard/enrolled-courses?courses=${encodeURIComponent(
        JSON.stringify(courses.map(c => c.courseId))
      )}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        userId,
        courses: JSON.stringify(courses.map((c) => c.courseId)),
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.log("Stripe Multiple Checkout Error:", error);
    return res.status(500).json({ success: false, message: "Payment error" });
  }
};

exports.verifyAndEnroll = async (req, res) => {
  try {
    console.log("🔥 verifyAndEnroll HIT");

    const userId = req.user.id;
    let { courses, courseId } = req.body; // array of courseIds
    // Normalize to array for single purchase
    if (!courses && courseId) {
      courses = [courseId];
    }

    const user = await User.findById(userId);

    for (let courseId of courses) {
      const course = await Course.findById(courseId);
      if (!course) continue;

       if (user.enrolledCourses.includes(courseId)) {
        console.log("⛔ Already enrolled → Skipping:", courseId);
        continue;
      }

      // Add user to course and vice versa
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId, purchaseHistory: courseId }
      });

      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { studentsEnrolled: userId }
      });

      // Send separate email for each course
      await mailSender(
        user.email,
        `Enrollment Confirmation for ${course.courseName}`,
        `
          <h2>Hello ${user.firstName},</h2>
          <p>🎉 You are enrolled in:</p>
          <h3>${course.courseName}</h3>
          <p>Check it now in your Enrolled Courses!</p>
        `
      );
    }

    return res.json({ success: true, message: "Enrollment complete" });

  } catch (error) {
    console.log("verifyAndEnroll error:", error);
    return res.status(500).json({ success: false });
  }
};
