const router = require("express").Router();
const auth = require("../middleware/auth");
const crud = require("../utils/crudFactory");
const Gallery = require("../models/Gallery");
crud(router, Gallery, auth);
module.exports = router;
