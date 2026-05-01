const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Team = require("../models/Team");
crud(router, Team, auth);
module.exports = router;
