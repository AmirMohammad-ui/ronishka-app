const Message = require("../controllers/messages")
const User = require("../controllers/users")
const catchAsync = require("../middlewares/catchAsync")
const express = require("express")
const router = express.Router()
router.route("/message").post(catchAsync(Message.newMessage))
router.route("/delete-message/:id").get(catchAsync(User.protect),catchAsync(User.restrictTo("admin")),catchAsync(Message.deleteMessage))
module.exports= router
