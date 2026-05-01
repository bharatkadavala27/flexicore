const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Career = require("../models/Career");
crud(router, Career, auth);
module.exports = router;
