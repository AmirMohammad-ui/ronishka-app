const catchAsync = require("../middlewares/catchAsync")
const Content = require("../controllers/contents")
const express = require("express")
const router = express.Router()

router
    .route("/wasituseful")
    .get(catchAsync(Content.wasituseful))
router
    .route("/new-view")
    .get(catchAsync(Content.newView))
router
    .route("/search-contents")
    .get(catchAsync(Content.lookForKeyword))
module.exports = router;