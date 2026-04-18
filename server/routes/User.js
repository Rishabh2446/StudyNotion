const express = require("express");
const router = express.Router();

// import controllers
const { signUp, login,  changePassword, } = require("../controllers/Auth");
const { contactUs } = require("../controllers/ContactUs");
const {resetPasswordToken, resetPassword} = require("../controllers/Auth")

// middleware importing
const {auth} = require("../middlewares/auth");



// signup route
router.post("/signup", signUp);

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
