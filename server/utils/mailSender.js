const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const mailSender = async (email, title, body) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    to: [{ email }],
    sender: { email: "studynotion.verify@gmail.com", name: "StudyNotion" },
    subject: title,
    htmlContent: body,
  });

  console.log("✅ Email sent via Brevo to:", email);
};

module.exports = mailSender;
