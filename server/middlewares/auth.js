const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth->
exports.auth = async (req, res, next) =>{
    try{
        // extract token
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.body?.token) {
      token = req.body.token;
    } else if (req.headers?.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }
        // if token missing
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token is missing",
            })
        }
        // verify the token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            // verification issue
              console.log("❌ JWT verification failed:", error.message);
            return res.status(401).json({
                success:false,
                message: error.name === "TokenExpiredError" ? "Token expired" : "Token is invalid",          
            })

        }
        next();
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Something went wrong while validating token."
        })
    }
}

// isStudent
exports.isStudent = async(req, res, next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for the Students only."
            })
        }
        next();
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"User role can not be verified"
        })
    }
}

// isInstructor
exports.isInstructor = async(req, res, next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for the Instructor only."
            })
        }
        next();
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"User role can not be verified"
        })
    }
}

// isAdmin
exports.isAdmin = async(req, res, next)=>{
    try{
        console.log("printing accoutType", req.user.accountType);
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for the Admin only."
            })
        }
        next();
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"User role can not be verified"
        })
    }
} 