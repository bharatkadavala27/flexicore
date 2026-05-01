const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const DailyUpdate = require("../models/DailyUpdate");
crud(router, DailyUpdate, auth);
module.exports = router;
