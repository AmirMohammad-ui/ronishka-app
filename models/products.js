const mongoose = require('mongoose')
const {Miladi_Jalali} = require("../utilities/convertDate")

const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true,
    min: [0, "قیمت نمی تواند کمتر از 0 تومان باشد."]
  },
  views: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    trim: true,
    min: [
      0, "تخفیف نمی تواند کمتر از 0 تومان باشد."
    ],
    validate: {
      validator: function (val) {
        return val <= this.price;
      },
      message: 'تخفیف نمی تواند بیشتر از قیمت کالا باشد.'
    }
  },
  seller: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    trim: true,
    required: true,
    minlength: [
      200, 'مقدار وارد شده برای توضیحات محصول باید حداقل 200 حرف باشد.'
    ],
    maxlength: [500, 'مقدار وارد شده برای توضیحات محصول باید حداکثر 500 حرف باشد.']
  },
  image: {
    type: String,
    default: 'placeholder.jpg',
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  forContent: {
    type: Schema.Types.ObjectId,
    ref: 'content'
  },
  linkToProductPage: {
    type: String,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isPublished: {
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
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
productSchema.virtual("discountPercentage").get(function () {
  return this.discount > 0 ? Math.floor(this.discount * 100 / this.price) : 0;
})


const Product = mongoose.model("product", productSchema)

exports.Product = Product;
