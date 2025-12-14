const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // 🔥 MUST be true for 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // 🔥 Gmail App Password
      },
      connectionTimeout: 10000, // optional but helpful
    });

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
    throw error; // 🔥 don’t silently swallow errors
  }
};

module.exports = mailSender;
