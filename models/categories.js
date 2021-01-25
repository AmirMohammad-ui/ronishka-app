const mongoose = require("mongoose")
const slugify = require("slugify")
const config = require("config")
const d = require("debug")("app;categories-Model")
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    contents: [{
        type: Schema.Types.ObjectId,
        ref: 'content'
    }],
    slug: {
        type: String,
        default: function () {
            return slugify(`${this.name}`, {
                replacement: '-',
                locale: 'fa',
                remove: /[*+~.()'"!:@]/g
            });
        }
    }
})



const Category = mongoose.model("category", categoriesSchema);

exports.Category = Category;