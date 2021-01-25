const mongoose =require("mongoose")
const {Miladi_Jalali} = require("../utilities/convertDate")
const Schema = mongoose.Schema;
const adsSchema = new Schema({
  image:{
    type:String,
    required:true,
    trim:true
  },
  forContent:{
    type: String,
    trim:true
  },
  star:{
    type:Boolean,
    default:false
  },
  star2:{
    type:Boolean,
    default:false
  },
  starHome:{
    type:Boolean,
    default:false
  },
  star2Home:{
    type:Boolean,
    default:false
  },
  adLink:{
    type:String,
    required:[true,"وارد کردن لینک اجباری است."],
    trim:true
  },
  confirmed:{
    type:Boolean,
    default: false
  },
  name:{
    type:String
  },
  inHomePage:{
    type:Boolean,
    default:false
  },
  inCategoryPage:{
    type:Boolean,
    default:false
  },
  sportCategory:{
    type: Boolean,
    default:false
  },
  beautyCategory:{
    type: Boolean,
    default:false
  },
  healthCategory:{
    type: Boolean,
    default:false
  },
  digitalCategory:{
    type: Boolean,
    default:false
  },
  foodCategory:{
    type: Boolean,
    default:false
  },
  clothCategory:{
    type: Boolean,
    default:false
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
})

const Ads = mongoose.model("ads",adsSchema)
exports.Ads = Ads;