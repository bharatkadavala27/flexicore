const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Certificate = require("../models/Certificate");
crud(router, Certificate, auth);
module.exports = router;
