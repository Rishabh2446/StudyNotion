const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  await resend.emails.send({
    from: "StudyNotion <onboarding@resend.dev>",
    to: email,
    subject: title,
    html: body,
    reply_to: "studynotion.verify@gmail.com",
  });

  console.log("✅ Email sent via Resend to:", email);
};

module.exports = mailSender;
