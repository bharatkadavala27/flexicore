const router = require("express").Router();
const auth = require("../middleware/auth");
const createCrud = require("../utils/crudFactory");
const Enquiry = require("../models/Enquiry");
const sendEmail = require("../utils/mailer");
const crud = createCrud(Enquiry);

router.get("/", auth, crud.getAll);
router.get("/:id", auth, crud.getOne);

router.post("/", async (req, res) => {
  try {
    console.log("Received new enquiry submission:", req.body);
    const doc = await Enquiry.create(req.body);
    
    // Send email notification
    try {
      console.log("Attempting to send email to:", process.env.MAIL_USERNAME);
      await sendEmail({
        to: process.env.MAIL_USERNAME,
        replyTo: req.body.email,
        subject: `New Enquiry: ${req.body.subject || 'No Subject'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Website Enquiry</h2>
            <p><strong>Type:</strong> ${req.body.type || 'N/A'}</p>
            <p><strong>Name:</strong> ${req.body.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${req.body.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${req.body.phone || 'N/A'}</p>
            <p><strong>Country:</strong> ${req.body.country || 'N/A'}</p>
            <p><strong>Subject:</strong> ${req.body.subject || 'N/A'}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #000;">
              <strong>Message:</strong><br/>
              ${(req.body.message || 'No message').replace(/\n/g, '<br/>')}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
              This enquiry was sent from the contact form on flexicore.in
            </p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error("Email failed to send, but enquiry was saved:", mailErr);
    }

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", auth, crud.update);
router.delete("/:id", auth, crud.remove);

module.exports = router;
