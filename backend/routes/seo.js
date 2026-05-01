const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Seo = require("../models/Seo");
crud(router, Seo, auth);
module.exports = router;
