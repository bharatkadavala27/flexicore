const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Expo = require("../models/Expo");
crud(router, Expo, auth);
module.exports = router;
