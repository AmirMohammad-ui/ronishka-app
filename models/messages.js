const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const {Miladi_Jalali} = require("../utilities/convertDate")
const schema = new Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true
  },
  textMessage:{
    type:String,
    required:true,
    trim:true
  },
  type:{
    type:String,
    enum:["message","request"],
    default:"message",
    trim:true
  },
  dateCreated:{
    type:Date,
    default:Date.now
  },
  persianDate: {
    type: String,
    default: function () {
      const dateObj = new Date;
      const year = dateObj.getFullYear().toString() * 1;
      const month = dateObj.getMonth().toString() * 1 === 0 ? 1: dateObj.getMonth().toString() * 1;
      const day = dateObj.getDate().toString() * 1;
      return Miladi_Jalali(year, month, day);
    }
  },
  timeCreated: {
    type: String,
    default: function () {
      const dateO = new Date;
      const hour = dateO.getHours();
      const minute = dateO.getMinutes();
      const second = dateO.getSeconds();
      return `${
        hour <= 12 ? 'صبح' : 'بعد از ظهر'
      }   ${
        hour.toString()
      }:${
        minute.toString()
      }:${
        second.toString()
      }`;
    }
  }
})
const Message = mongoose.model("message",schema)
exports.Message = Message