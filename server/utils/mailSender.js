const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    await resend.emails.send({
      from: "StudyNotion <onboarding@resend.dev>",
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Email sent via Resend to:", email);
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw error;
  }
};

module.exports = mailSender;
