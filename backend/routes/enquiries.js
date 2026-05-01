const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Enquiry = require("../models/Enquiry");
crud(router, Enquiry, auth);
module.exports = router;
