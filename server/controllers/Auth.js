const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const Profile = require('../models/Profile');


//SendOTp
exports.sendOTP = async(req, res)=>{

    try{
        // fetch email from request body->
        console.log("➡ sendOTP hit:", req.body);
        let {email} = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        email = email.trim().toLowerCase();
        console.log("✔ Normalized email:", email);

        // check if user already exists->
        const checkUserPresent = await User.findOne({email});
        console.log("✔ User exists:", !!checkUserPresent);

        // if user already present , return response ->
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        
        // generate otp (user not already exist)
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("OTP generated: ", otp);

        // check otp is unique or not
        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});      
        }

        // entry OTP IN DB->
        const otpPayload = {email, otp}; 
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        console.log("✔ OTP saved in DB:", otpBody._id);

        // SEND EMAIL TO USER
            console.log("➡ Calling mailSender...");
        mailSender(
            email,
            "Your OTP Code",
            `Your OTP verification code is: ${otp}\nValid for 5 minutes.`
        ).catch((err) => console.error("OTP email failed:", err));
            console.log("✔ OTP email sent successfully");

        // return successful response
        res.status(200).json({
            success:true,
            message:'OTP sent successfully.',
            
        });

        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Otp could not sent!",
        })
    }
}

exports.verifyOTP = async (req, res) => {
    console.log("verifyOTP hit:", req.body);

  try {
    const { email, otp, firstName, lastName, password, accountType } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // check otp from DB (assuming you stored it during sendOTP)
    const userOtp = await OTP.findOne({ email, otp });

    if (!userOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

     if (userOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
    });

    

    return res.status(200).json({
      success: true,
      message: "Email verified & account created",
      
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// signUp
exports.signUp = async(req, res)=>{

    try{
            // data fetch from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // validate data ->
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success:false,
                message:"All feilds are required",
            });
        }

        // match two password(password, confirm password)
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword value does not match, please try again.",
            });
        }
        // check user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already exist",
            });
        }

        // find most recent OTP stored for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt: -1}).limit(1);
        console.log("recent otp", recentOtp);

        // validate OTP
        if(recentOtp.length == 0){
            // otp not found
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            });
        }else if(otp !== recentOtp.otp){
            // Invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create entry in DB

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // return res
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"User cannot be registered, Please try again!"
        })
    }
    

}

// Login
exports.login = async(req, res)=>{
    try{
        // get data from req body
        const {email, password} = req.body;

        // validation of data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All feilds are required, Please try again.",
            });
        }
        // check karo user exist kartaa hai ki nahi
        const emailLower = email.trim().toLowerCase();
        const user = await User.findOne({email : emailLower}).populate("additionalDetails");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User is not registered, Please sign up first!"
            });
        }
        // generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options ={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Password is incorrect",
            })
        }
        
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Login Failure, Please try again!",
        });
    }
}

// change password
exports.changePassword = async(req, res)=>{
    try{
        //get data from req body
        // get oldPassword, newPassword, confirmNewPassword
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        // validation->
        if(!oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"New password do not match to confirm password",
            })
        }

        // get logged in user from db
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }

        // compare old password->
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Old password is incorrect!",
            })
        }

        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update password in DB
        user.password = hashedPassword;
        await user.save();

        // send mail - Password Updated
        await mailSender(
            user.email,
            "Password updated successfully",
            "Your account password has been changed. If this wasn't you, please reset your password immediately."
        );

        // return response
        res.status(200).json({
            success:true,
            message:"Password updated successfully",
        });
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:"Server error",
        })
    }
    
}

// Forgot Password - Generate Reset Link
exports.resetPasswordToken = async (req, res) => {
  try {
    console.log("resetPasswordToken route hit");
    const { email } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // generate token
    const token = crypto.randomUUID(); // or crypto.randomBytes(20).toString("hex");

    // set resetPasswordToken and expiry in DB
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    // create reset URL
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail
    await mailSender(
      email,
      "Password Reset Link",
      `Click here to reset your password: ${url}`
    );

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while generating reset password token",
    });
  }
};

// Reset Password - Change password with token
exports.resetPassword = async (req, res) => {
  try {
       console.log("resetPassword route hit");
  console.log("Incoming reset request body:", req.body);


    const { token, newPassword, confirmPassword } = req.body;
    console.log("ResetPassword values:", { token, newPassword, confirmPassword });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while resetting password",
    });
  }
};

