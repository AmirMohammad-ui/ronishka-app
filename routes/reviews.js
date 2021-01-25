const express = require("express")
const router = express.Router()
const Reviews = require("../controllers/reviews");
const User = require("../controllers/users");
const catchAsync = require("../middlewares/catchAsync");

router.route("/send-comment").post(catchAsync(Reviews.sendComment))
router.route("/reply-comment").post(catchAsync(Reviews.sendReply))
router.route("/confirm-comment/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")),catchAsync(Reviews.confirmComment))
router.route("/unconfirm-comment/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")),catchAsync(Reviews.unConfirmComment))
router.route("/search-for-comment").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")),catchAsync(Reviews.searchForComment))


module.exports = router;
