const Category = require("../controllers/categories")
const catchAsync = require("../middlewares/catchAsync");
const express = require("express");
const router = express.Router();

router
    .route("/create-category")
    .post(catchAsync(Category.createCategory))

module.exports = router;