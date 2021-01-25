const User = require("../controllers/users")
const express = require("express")
const catchAsync = require("../middlewares/catchAsync")
const router = express.Router()

router
  .route("/login")
  .post(catchAsync(User.login))
router
  .route("/register")
  .post(catchAsync(User.SignupUser))
router
  .route('/register-content-creators')
  .post(catchAsync(User.SignupCreator))
router.route("/logout").get(catchAsync(User.logout))
module.exports = router;