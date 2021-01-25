const Ads  = require("../controllers/ads")
const User  = require("../controllers/users")
const express = require("express");
const catchAsync = require("../middlewares/catchAsync");
const router = express.Router()

router.route("/advertizement").post(catchAsync(User.protect),catchAsync(User.restrictTo("admin")),catchAsync(Ads.newAd));
router.route("/search-ad").get(catchAsync(User.protect),catchAsync(User.restrictTo("admin")),catchAsync(Ads.searchAd));
router.route("/advertizement/save/:id").post(catchAsync(User.protect),catchAsync(User.restrictTo("admin")),catchAsync(Ads.updateAd));
router.route("/advertizement/delete/:id").get(catchAsync(User.protect),catchAsync(User.restrictTo("admin")),catchAsync(Ads.deleteAd));

module.exports = router;