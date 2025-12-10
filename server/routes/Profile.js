const express = require("express");
const router = express.Router();

// middlewares
const { auth, isStudent } = require("../middlewares/auth");

// controllers
const { updateProfile, deleteAccount, getAllUserDetails, getEnrolledCourses, getPurchaseHistory, updateDisplayPicture} = require("../controllers/Profile");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");


// update profile (only logged-in user)
router.put("/updateProfile", auth, updateProfile);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// delete account (only logged-in user)
router.delete("/deleteAccount", auth, deleteAccount);

// get all details of logged-in user
router.get("/getUserDetails", auth, getAllUserDetails);

// generate reset token and send mail
router.post("/reset-password-token", resetPasswordToken);

// reset password using token
router.post("/reset-password", resetPassword);

router.get("/enrolled-courses", auth, getEnrolledCourses);
router.get("/purchase-history", auth, isStudent, getPurchaseHistory);


module.exports = router;
