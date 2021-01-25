const mongoose = require("mongoose")
const {Miladi_Jalali} = require("../utilities/convertDate")
const slugify = require("slugify")
const Schema = mongoose.Schema;
const contentSchema = new Schema({
  topic: {
    type: String,
    trim: true,
    required: true,
    maxlength: [80, '(حداکثر 80 کاراکتر) .موضوع انتخاب شده خیلی طولانی است']
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    minlength: [
      100, 'متن وارد شده برای خلاصه خیلی کوتاه است. (حداقل 100 کاراکتر)'
    ],
    maxlength: [500, 'متن وارد شده برای خلاصه خیلی طولانی است. (حداکثر 500 کاراکتر)']
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true
  },
  resource: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    type: [String],
    trim: true
  },
  files: {
    type: [String],
    trim: true
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review'
    }
  ],
  category: {
    type: String,
    required: true,
    trim: true
  },
  isUseful: {
    type: Number,
    trim: true,
    default: 0
  },
  ratingAvg: {
    type: Number,
    trim: true,
    default: 0
  },
  ratingQuantity: {
    type: Number,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product'
    }
  ],
  isPublished: {
    type: Boolean,
    default: false
  },
  keywords: {
    type: [String],
    required: true
  },
  post: {
    type: [Object]
  },
  slug: {
    type: String,
    default: function () {
      return slugify(`${
        this.topic
      }`, {
        replacement: '-',
        locale: 'fa',
        remove: /[*+~.()'"!:@]/g
      });
    }
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
const Content = mongoose.model("content", contentSchema)


exports.Content = Content;
