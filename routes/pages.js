const d = require("debug")("app:pages-route-handler")
const catchAsync = require("../middlewares/catchAsync")
const ERR = require("../utilities/ERR")
const Pages = require("../controllers/pages")
const User = require("../controllers/users")
const express = require("express")
const router = express.Router()

router
	.route("/")
	.get(catchAsync(Pages.getHome))
router
router
	.route("/content/:slug")
	.get(catchAsync(Pages.getContent))
router
	.route("/about")
	.get(catchAsync(Pages.getAbout))
router
	.route("/complaint")
	.get(catchAsync(Pages.getComplaint))
router
	.route("/category/:slug/:page")
	.get(catchAsync(Pages.getCategory))
router
	.route("/rules")
	.get(catchAsync(Pages.getRules))
router
	.route("/signup-login")
	.get(catchAsync(Pages.getSignup));
router
	.route("/create-content-post")
	.get(
		catchAsync(User.protect),
		catchAsync(User.restrictTo("content-creator", "admin")),
		catchAsync(Pages.getCreateYourPostnow));
router
	.route("/creators-panel")
	.get(
		catchAsync(User.protect),
		catchAsync(User.restrictTo("content-creator", "admin")),
		catchAsync(Pages.getContentCreatorsPanel));
module.exports = router