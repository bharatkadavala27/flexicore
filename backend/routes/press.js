const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Press = require("../models/Press");
crud(router, Press, auth);
module.exports = router;
