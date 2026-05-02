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
    const doc = await Enquiry.create(req.body);
    
    // Send email notification
    try {
      await sendEmail({
        to: process.env.MAIL_USERNAME,
        subject: `New Enquiry: ${req.body.subject || 'No Subject'}`,
        html: `
          <h3>New Website Enquiry</h3>
          <p><strong>Type:</strong> ${req.body.type || 'N/A'}</p>
          <p><strong>Name:</strong> ${req.body.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${req.body.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${req.body.phone || 'N/A'}</p>
          <p><strong>Country:</strong> ${req.body.country || 'N/A'}</p>
          <p><strong>Subject:</strong> ${req.body.subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${req.body.message || 'No message'}</p>
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
