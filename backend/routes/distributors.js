const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Distributor = require("../models/Distributor");
crud(router, Distributor, auth);
module.exports = router;
