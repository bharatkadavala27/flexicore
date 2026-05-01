const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const TrustedBy = require("../models/TrustedBy");
crud(router, TrustedBy, auth);
module.exports = router;
