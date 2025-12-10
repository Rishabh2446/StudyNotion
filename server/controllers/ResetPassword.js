const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// resetPasswordToken
exports.resetPasswordToken = async (req, res)=>{
    try{
        //get email from req body
        const email = req.body.email;

        // validation of email
        // check user is present or not
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Your email is not registered with us",
            })
        }

        // generate token
        const token = crypto.randomUUID();

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email:email},
            {
                token:token,
                resetPasswordExpires:Date.now() + 5*60*1000,
            },
            {new:true}
        );

        // create url
        const url = `http://localhost:3000/update-password/${token}`

        // send mail containing the url
        await mailSender(email,
             "Password reset link",
            `Password reset Link: ${url}`
        );
        //return response
        return res.json({
            success:true,
            message:"Email sent successfully, Please check email and change your password",
        })
    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"Something went wrong while sending reset password email"
        })

    }
}


//resetPassword
exports.resetPassword = async (req, res)=>{
    try{
        // fetch data
        const {password, confirmPassword, token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            })
        }
        // get userdetails from db using  token
        const userdetails = await User.findOne({token:token});
        // if no entry - invalid token
        if(!userdetails){
            return res.json({
                success:false,
                message:"Token invalid",
            })
        }
        // token time check
        if(userdetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired, Please regenerate your tokan",
            })
        }
        // hash passworsd
        const hashedPassword = await bcrypt.hash(password, 10);

        // password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        )
        // return response
        return res.status(200).json({
            success:true,
            message:"Password reset successfully",
        })
    }
    catch(error){
        console.log(error)
        return res.json({
            success:false,
            message:"Something went wrong while reseting password "
        })
    }
}