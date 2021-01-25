const express = require("express");
const catchAsync = require("../middlewares/catchAsync");
const router = express.Router()
const Search = require("../utilities/search")

router
    .route("/search")
    .get(catchAsync(Search.search));


module.exports = router;