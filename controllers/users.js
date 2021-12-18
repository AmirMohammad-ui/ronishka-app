const {
	sendWelcomeEmail
} = require("../utilities/email")
const config = require('config')
const jwt = require("jsonwebtoken")
const d = require("debug")("app:users-controller")
const chalk = require('chalk');
const {
	promisify
} = require("util")
const {
	User
} = require("../models/users")
const ERR = require("../utilities/ERR");

// ############################################################ providing and sending token to headers
function createSendToken(user, req, res) {
	const token = user.createJWTtoken();
	let cookieOptions = {
		maxAge: 60 * 60 * 1000,
		httpOnly: true
	}
	req.session.user = user._id;
	req.session.loggedIn = 1;
	req.session.role = user.role;
	if (req.body.rememberMe === 'yes') {
		cookieOptions.maxAge = config.get("CookieExpires") * 60 * 60 * 1000 * 24;
		req.session.cookie.originalMaxAge = config.get("session.expires") * 60 * 60 * 24 * 1000;
	}
	// if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	res.cookie('x-jwt-token', `Bearer ${token}`, cookieOptions);
}
// ############################################################ success response
function OKresponse(someData, res, statusCode, message) {
	if (!someData) {
		someData = null;
	}
	res.status(statusCode).json({
		status: "success",
		message,
		someData
	})
}

async function sendWelcome(user) {
	const {
		email,
		fname
	} = user;
	const mailOptions = {
		email,
		fname
	}
	try {
		await sendWelcomeEmail(mailOptions)
		return true;
	} catch (err) {
		d(chalk.red("در ارسال ایمیل خوش آمد گویی مشکلی به وجود امده است."));
		return false;
	}
}
// ############################################################ signing up user
exports.SignupUser = async (req, res, next) => {
	if (await User.findOne({
			email: req.body.email
		})) return next(new ERR("این ایمیل قبلا ثبت نام کرده است ، لطفا وارد شوید.", 400))
	if (await User.findOne({
			phone_number: req.body.phone_number
		})) return next(new ERR("این شماره همراه قبلا ثبت نام کرده است ، لطفا وارد شوید.", 400))
	if (req.body.password !== req.body.passwordConfrim) return next(new ERR("رمز تایید و رمز وارد شده تطابق ندارند.", 400))
	if (!req.body.privacy_policy || (req.body.privacy_policy.toLowerCase()) !== 'yes') return next(new ERR('برای ثبت نام در سایت شما باید با تمام قوانین و مقررات موافقت کنید.', 400))
	let user = new User({
		fname: req.body.fname,
		lname: req.body.lname,
		email: req.body.email,
		phone_number: req.body.phone_number,
		password: req.body.password,
		passwordConfrim: req.body.passwordConfrim,
		role: 'user'
	})
	const isSent = sendWelcome(user)
	if (!isSent) return next(new ERR("در ثبت نام شما مشکلی پیش آمده لطفا از صحت ایمیل خود مطمئن شوید و دوباره امتحان کنید."))
	await user.save()
	createSendToken(user, req, res);
	OKresponse(user, res, 201, 'تبریک شما با موفقیت به جمع خانواده رونیشکا پیوستید. !')
}
// ############################################################ signing up content creator
exports.SignupCreator = async (req, res, next) => {
	if (await User.findOne({
			email: req.body.email
		})) return next(new ERR("این ایمیل قبلا ثبت نام کرده است ، لطفا وارد شوید.", 400))
	if (await User.findOne({
			phone_number: req.body.phone_number
		})) return next(new ERR("این شماره همراه قبلا ثبت نام کرده است ، لطفا وارد شوید.", 400))
	if (req.body.password !== req.body.passwordConfrim) return next(new ERR("رمز تایید و رمز وارد شده تطابق ندارند.", 400))
	if (!req.body.privacy_policy || (req.body.privacy_policy.toLowerCase()) !== 'yes') return next(new ERR('برای ثبت نام در سایت شما باید با تمام قوانین و مقررات موافقت کنید.', 400))
	const {
		fname,
		lname,
		email,
		phone_number,
		password,
		passwordConfrim,
		province_value,
		city_value,
		birthDate_value,
		categories,
	} = req.body;
	let user = new User({
		fname,
		lname,
		email,
		dateofBirth: birthDate_value,
		phone_number,
		password,
		passwordConfrim,
		city: city_value,
		province: province_value,
		categories,
		role: 'user'
	})
	const isSent = sendWelcome(user)
	if (!isSent) return next(new ERR("در ثبت نام شما مشکلی پیش آمده لطفا از صحت و درستی ایمیل خود مطمئن شوید و دوباره امتحان کنید."))
	await user.save()
	createSendToken(user, req, res);
	OKresponse(user, res, 201, 'اطلاعات شما دریافت شد. پس از بررسی ، نتیجه به ایمیل شما ارسال خواهد شد.')
}
// ############################################################ login
exports.login = async (req, res, next) => {
	const user = await User.findOne().or([{
		email: req.body.emailOrPhoneNumber
	}, {
		phone_number: req.body.emailOrPhoneNumber
	}]).select("password role fname lname email");
	if (!user) return next(new ERR("ایمیل  ، شماره همراه یا پسورد وارد شده اشتباه می باشد.", 401));
	if (!(await user.isCorrectPassword(req.body.password, user.password))) return next(new ERR("ایمیل  ، شماره همراه یا پسورد وارد شده اشتباه می باشد.", 401));
	createSendToken(user, req, res);
	OKresponse(user, res, 200, 'شما با موفقیت وارد شدید.');
}
// ############################################################ protect

exports.protect = async (req, res, next) => {
	let token;
	if (req.headers.cookie.includes("x-jwt-token") && req.headers.cookie.includes("Bearer") && req.session.loggedIn === 1) {
		token = req.headers.cookie.split('x-jwt-token=Bearer%20')[1];
		if (token.includes(";")) token = token.split(';')[0]
	} else {
		token = '';
	}

	if (token === '' || !token || !req.headers.cookie.includes("x-jwt-token"))
		return next(new ERR("شما اجازه دسترسی به این صفحه را ندارید .", 403))
	const decoded = promisify(await jwt.verify)(token, config.get("JwtSecret"))
	if (!decoded) return next(new ERR('شما اجازه دسترسی به این صفحه را ندارید ، لطفا دوباره وارد شوید.', 403))
	decoded.then(async us => {
		let user = await User.findOne({
			_id: us.id
		})
		if (!user) return next(new ERR('خطا در تایید هویت شما ، لطفا دوباره وارد شوید و سپس امتحان کنید.', 403))
		req.user = user;
		next();
	}).catch(err => {
		return next(new ERR(err, 52356))
	})
}
// ############################################################ forgot password
exports.restrictTo = (...roles) => {
	return async (req, res, next) => {
		if (!req.user)
			return next(new ERR('شما اجازه دسترسی به این صفحه را ندارید ، لطفا دوباره وارد شوید.', 403))
		if (!roles.includes(req.user.role)) {
			return next(new ERR('شما اجازه دسترسی به این صفحه را ندارید ، لطفا دوباره وارد شوید.', 403))
		} else {
			next();
		}
	}
}
// ############################################################ forgot password
exports.logout = async (req, res) => {
	res.cookie("x-jwt-token", 'Logged Out')
	req.session.destroy()
	res.redirect('/');
}
// ############################################################ forgot password
// const forgotPassword = async(req,res,next)=>{

// }
// ############################################################ reset password
// const resetPassword = async(req,res,next)=>{

// }
// ############################################################ is user logged in