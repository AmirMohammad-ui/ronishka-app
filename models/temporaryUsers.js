const mongoose = require("mongoose")
const Validator = require("validator")
const Schema = mongoose.Schema;

const tempUser = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate: [Validator.isEmail, "فرمت ایمیل وارد شده صحیح نمی باشد."],
    lowercase:true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
})

const TempUser = mongoose.model("tempUser", tempUser)

exports.TempUser = TempUser;
