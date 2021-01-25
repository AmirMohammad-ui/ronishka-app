const config = require("config")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Validator = require("validator")

const Schema = mongoose.Schema
const userSchema = new Schema({
	fname: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 20,
	},
	lname: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 20,
	},
	role: {
		type: String,
		enum: ["admin", "content-creator", "user"],
		required: true
	},
	phone_number: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	dateofBirth: {
		type: Date,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase:true,
		validate: [Validator.isEmail, "فرمت ایمیل وارد شده صحیح نمی باشد."]
	},
	password: {
		type: String,
		minlength: 8,
		required: true,
		trim: true,
		select: false
	},
	passwordConfrim: {
		type: String,
		minlength: 8,
		required: true,
		trim: true,
		validate: {
			validator: function (val) {
				return val === this.password
			},
			message: "Passwords do not match."
		}
	},
	city: {
		type: String,
		trim: true,
	},
	province: {
		type: String,
		trim: true,
	},
	categories: {
		type: [String],
		trim: true,
	},
	contents: [{
		type: Schema.Types.ObjectId,
		ref: "content"
	}],
	date_registered: {
		type: Date,
		default: Date.now
	}
});
userSchema.methods.isCorrectPassword = async function (reqPass, userPass) {
	return await bcrypt.compare(reqPass, userPass);
}
userSchema.pre("save", async function () {
	if (this.isModified("password") && this.isNew) {
		let passHashed = await bcrypt.hash(this.password, 12);
		this.password = passHashed;
		this.passwordConfrim = undefined;
	}
})
userSchema.methods.createJWTtoken = function () {
	const token = jwt.sign({
		id: this._id,
		email: this.email
	}, config.get("JwtSecret"), {
		expiresIn: config.get("JwtExpires") * 24 * 60 * 60 * 1000
	});
	return token;
}

const User = mongoose.model("user", userSchema)

exports.User = User