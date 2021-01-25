const Product = require("../controllers/products")
const User = require("../controllers/users")
const catchAsync = require("../middlewares/catchAsync")
const express = require("express")
const router = express.Router();

router
    .route("/create-product")
    .post(
        catchAsync(User.protect),
        catchAsync(User.restrictTo("content-creator", "admin")),
        catchAsync(Product.createNewProduct));


module.exports = router;