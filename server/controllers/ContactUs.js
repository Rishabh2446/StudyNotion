const mailSender = require("../utils/mailSender");


exports.contactUs = async(req, res)=>{
    try{
        const {firstName, lastName, email, phoneNumber, message} = req.body;
        console.log("📩 ContactUs request body:", req.body);


        // validation
        if(!firstName || !lastName || !email || !phoneNumber || !message){
            return res.status(400).json({
                success:false,
                message:"All fields are required.",
            });
        }

        // send mail to student
        await mailSender(email, "We recieved your message!",
             `Hello ${firstName},\n\nThank you for contacting us. Our team will get back to you soon.\n\nYour message:\n${message}\n StudyNotion Team`,

        );

        // send mail to admin/studynotion
        await mailSender(process.env.STUDYNOTION_MAIL, "New contact Us request",
             `New request received:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}`,
        );

        return res.status(200).json({
            success:true,
            message:"Message sent successfully!",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Could not send message. Try again later.",
            error:error.message,
        });
    }
}