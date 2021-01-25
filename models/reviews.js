const mongoose = require("mongoose")
const {Miladi_Jalali} = require("../utilities/convertDate")
const Schema = mongoose.Schema

const reviewsSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['user', 'tempUser']
  },
  forContent: {
    type: Schema.Types.ObjectId,
    ref: 'content'
  },
  replies:[{
    type:Schema.Types.ObjectId,
    ref: "reply"
  }],
	text: {
		type:String,
		required:true,
	},
  isConfirmed: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
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
        hour.toString()
      }:${
        minute.toString()
      }:${
        second.toString()
      }`;
    }
  }
})
const Review = mongoose.model("review", reviewsSchema)
const repliesSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['user', 'tempUser']
  },
  forReview: {
    type: Schema.Types.ObjectId,
    ref: 'review'
  },
  forContent: {
    type: Schema.Types.ObjectId,
    ref: 'content'
  },
	text: {
		type:String,
		required:true,
	},
  isConfirmed: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
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
        hour.toString()
      }:${
        minute.toString()
      }:${
        second.toString()
      }`;
    }
  }
})
const Reply = mongoose.model("reply", repliesSchema)

exports.Review = Review;
exports.Reply = Reply;
