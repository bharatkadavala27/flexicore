const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: (process.env.MAIL_HOST || "").replace(/^https?:\/\//, "").replace(/\/$/, ""),
  port: parseInt(process.env.MAIL_PORT || "465"),
  secure: (process.env.MAIL_PORT == 465 || process.env.MAIL_ENCRYPTION === "ssl"),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Often needed for Hostinger shared hosting
  },
  debug: true,
  logger: true
});

const fromName = (process.env.MAIL_FROM_NAME || "Flexicore").replace(/^"|"$/g, "");
const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME;

console.log(`Mailer initialized for ${process.env.MAIL_HOST} (Secure: ${process.env.MAIL_PORT == 465})`);

const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
      replyTo: replyTo || process.env.MAIL_FROM_ADDRESS,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
