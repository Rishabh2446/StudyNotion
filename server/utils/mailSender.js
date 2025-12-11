const nodemailer = require("nodemailer");

// create transporter ONCE — reuse for all emails
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const mailSender = async (email, title, body) => {
    try {
        const info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Mail Error:", error);
        return null;
    }
};

module.exports = mailSender;
