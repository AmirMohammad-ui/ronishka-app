const {Message} = require("../models/messages")

exports.newMessage = async(req,res)=>{
  await Message.create({
    name: req.body.fullname,
    email: req.body.email,
    textMessage: req.body.textMessage
  })
  res.status(200).json({
    status:"success",
    message: 'پیام شما با موفقیت ارسال شد.'
  })
}
exports.deleteMessage = async(req,res) =>{
  const message =await Message.findByIdAndDelete(req.params.id)
  if(!message) return res.send("<h1>این محتوا قبلا حذف شده</h1>")
  res.send("<h1>پیام حذف شد.</h1>")
}