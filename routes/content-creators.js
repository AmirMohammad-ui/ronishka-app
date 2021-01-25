const express = require("express")
const catchAsync = require("../middlewares/catchAsync");
const Content = require("../controllers/content-creators");
const User = require("../controllers/users")
const router = express.Router();

router.route("/checkContentId").post(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.checkContent));
router.route("/create-content").post(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.createContent));
router.route("/create-content-post").post(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.createPost))
router.route("/upload-images").post(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.uploadingImage));
router.route("/upload-files").post(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.uploadingFile));
router.route("/download/:file/:filename").get(catchAsync(Content.downloadFile));
// finding the content or product
router.route("/search-for-content-name").get(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.getContentByTopic));
router.route("/search-for-content-id").get(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.getContentById));
router.route("/search-for-product-name").get(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.getProductByTopic));
router.route("/search-for-product-id").get(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.getProductById));
// upload the content or product
router.route("/upload/content/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.uploadTheContent));
router.route("/upload/product/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("content-creator", "admin")), catchAsync(Content.uploadTheProduct));
// confirm the content or product
router.route("/confirm/content/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")), catchAsync(Content.confirmTheContent));
router.route("/confirm/product/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")), catchAsync(Content.confirmTheProduct));
// unconfirm the content or product
router.route("/unConfirm/content/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")), catchAsync(Content.unConfirmTheContent));
router.route("/unConfirm/product/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin")), catchAsync(Content.unConfirmTheProduct));
// deleting the content or product
router.route("/delete/content/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin","content-creator")), catchAsync(Content.deleteTheContent));
router.route("/delete/product/:id").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin","content-creator")), catchAsync(Content.deleteTheProduct));

router.route("/allmycontents").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin","content-creator")), catchAsync(Content.getAllMyContents));
router.route("/allmyproducts").get(catchAsync(User.protect), catchAsync(User.restrictTo("admin","content-creator")), catchAsync(Content.getAllMyProducts));

module.exports = router;
