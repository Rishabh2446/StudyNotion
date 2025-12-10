const express = require("express");
const router = express.Router();

// import controllers
const { signUp, login, sendOTP, changePassword, verifyOTP } = require("../controllers/Auth");
const { contactUs } = require("../controllers/ContactUs");
const {resetPasswordToken, resetPassword} = require("../controllers/Auth")

// middleware importing
const {auth} = require("../middlewares/auth");

// Send OTP 
router.post("/send-otp", sendOTP);
router.post("/verifyOTP", verifyOTP);


// signup route
router.post("/signUp", signUp);

// login route
router.post("/login", login);

// change password route
router.post("/changePassword", auth, changePassword);

//reset password route
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// contact us route
router.post("/contact", contactUs);



module.exports = router;
