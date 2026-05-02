require("dotenv").config();
const sendEmail = require("./utils/mailer");

const test = async () => {
  console.log("Testing mail with settings:", {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USERNAME,
    from: process.env.MAIL_FROM_ADDRESS
  });

  try {
    await sendEmail({
      to: process.env.MAIL_USERNAME,
      subject: "Test Mail from Flexicore Local",
      text: "If you receive this, your SMTP settings are correct!",
      html: "<h1>Success!</h1><p>Your SMTP settings are working perfectly.</p>"
    });
    console.log("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ Test email failed:", error);
  }
};

test();
