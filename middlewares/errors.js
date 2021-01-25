const ERR = require("../utilities/ERR")
const d = require("debug")("app:errors");
const chalk = require("chalk");
const err_name = chalk.rgb(255, 0, 128);
const err_statusCode = chalk.rgb(255, 255, 0);
const err_message = chalk.rgb(211, 154, 148);
const err_stack = chalk.rgb(130, 125, 2);

const devErrors = (err, res) => {
	if (err.statusCode === 403 || err.statusCode === 400 && err.message.includes("مسیر") ? true : (err.message.includes("صفحه") ? true : (err.message.includes("یافت") ? true : false))) {
		res.render('pages/error', {
			title: err.statusCode === 403 ? 'دسترسی محدود' : 'یافت نشد',
			statusCode: err.statusCode,
			message: err.message,
			name: err.name,
			stack: err.stack,
			ERROR: err
		});
	} else if (err.statusCode === 52356) {
		res.render('pages/error', {
			title: 'خطای داخلی از سرور',
			statusCode: err.statusCode,
			message: err.message,
			name: 'مشکل در تایید توکن رخ داده است.',
			stack: err.stack,
			ERROR: err
		});
	} else if (err.statusCode === 4369) {
		res.render('pages/error', {
			title: 'خطای داخلی از سرور',
			statusCode: err.statusCode,
			message: err.message,
			name: 'مشکل در محل ذخیره فایل ها یا تصاویر رخ داده است.',
			stack: err.stack,
			ERROR: err
		});
	} else {
		res.status(err.statusCode).json({
			status: err.status,
			statusCode: err.statusCode,
			message: err.message,
			name: err.name,
			stack: err.stack,
			ERROR: err
		})
	}
}
// ###################################################################### Prod Errors
const prodErrors = (err, res) => {
	if (err.isOperational) {
		res.render("pages/error", {
			title: 'خطای داخلی از سرور',
			status: err.status,
			statusCode: err.statusCode,
			message: err.message
		})
	} else {
		res.render("pages/error", {
			title: 'خطای داخلی از سرور',
			status: "خطای داخلی از سرور",
			statusCode: 500,
			message: 'خطای داخلی از سرور ، لطفا بعدا دوباره امتحان کنید.'
		})
	}
}
// ###################################################################### duplicate User
const duplicateError = (err) => {
	if (err.message.includes("phone_number")) {
		return new ERR('این شماره تلفن قبلا ثبت نام کرده ، لطفا وارد شوید.', 400);
	} else if (err.message.includes("email")) {
		return new ERR('این ایمیل قبلا ثبت نام کرده ، لطفا وارد شوید.', 400);
	}
}
// ###################################################################### validation error
const validationErr = function (err) {
	return new ERR("Validation Error : " + err.message, 400)
}
// ###################################################################### cast error
const castError = function (err) {
	if (err.message.includes("Cast to ObjectId")) return new ERR("فرمت آیدی وارد شده صحیح نمی باشد.", 400)
}
// ###################################################################### cast error
const nofileDirectory = function (err) {
	return new ERR(" لطفا این مشکل را از طریق ارسال کد خطابه شماره همراه 09158964046 یا ایمیل support@ronishka.com با پشتیبانی سایت در میان بگذارید. با تشکر", 4369);
}
// ###################################################################### cast error
const reportThisError = function (err) {
	return new ERR(" لطفا این مشکل را از طریق ارسال کد خطابه شماره همراه 09158964046 یا ایمیل support@ronishka.com با پشتیبانی سایت در میان بگذارید. با تشکر", 52356);
}
// ###################################################################### Error handling middleware
module.exports = (err, req, res,next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "internal server error";
	console.log(err_statusCode(err.statusCode))
	console.log(err_name(err.name))
	console.log(err_message(err.message))
	console.log(err_stack(err.stack))
	if (process.env.NODE_ENV === 'development') {
		if (err.code === 11000 && err.name === 'MongoError') err = duplicateError(err);
		if (err.name === "ValidationError") err = validationErr(err)
		if (err.name === 'CastError') err = castError(err)
		if (err.name === "Error" && err.message.includes("ENOENT: no such file")) err = nofileDirectory(err)
		if (err.statusCode === 52356) err = reportThisError(err)
		devErrors(err, res)
	}
	if (process.env.NODE_ENV === 'production') {
		if (err.code === 11000 && err.name === 'MongoError') err = duplicateError(err);
		if (err.name === "ValidationError") err = validationErr(err)
		if (err.name === 'CastError') err = castError(err)
		if (err.name === "Error" && err.message.includes("ENOENT: no such file")) err = nofileDirectory(err)
		if (err.statusCode === 52356) err = reportThisError(err)
		prodErrors(err, res)
	}

}