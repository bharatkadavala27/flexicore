const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  requireTLS: true,
  family: 4,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
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
