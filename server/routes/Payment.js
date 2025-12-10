const express = require("express");
const router = express.Router();

// middleware
const { auth, isStudent } = require("../middlewares/auth");

const { createStripeSession, createStripeSessionMultiple } = require("../controllers/Payment");
const { verifyAndEnroll } = require("../controllers/Payment");


router.post("/create-stripe-session", auth, isStudent, createStripeSession);
router.post("/create-stripe-session-multiple", auth, isStudent, createStripeSessionMultiple)
console.log("Payment routes loaded");

router.post("/verify-and-enroll", auth, isStudent, verifyAndEnroll);


const { stripeWebhookHandler } = require("../controllers/stripeWebhook");
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);
module.exports = router;
