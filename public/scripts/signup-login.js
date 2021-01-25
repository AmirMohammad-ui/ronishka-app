
import axios from "axios"
export const hideAlert = () => {
	const el = document.getElementById("alert");
	if (el) el.parentElement.removeChild(el);
};
export const show_alert = (msg, type) => {
	hideAlert();
	if (msg instanceof Array && msg.length > 1) {
		let massages = '';
		msg.forEach(message => {
			if (message) {
				massages += `${message}</br>`;
			}
		})
		const template = `<div id="alert" class="alert__${type}">${massages}</div>`;
		document.querySelector("body").insertAdjacentHTML('afterbegin', template)
		return window.setTimeout(hideAlert, 7000)
	}
	if (msg instanceof Array && msg.length < 1 && msg.length === 1) {
		const template = `<div id="alert" class="alert__${type}">${msg[0]}</div>`;
		document.querySelector("body").insertAdjacentHTML('afterbegin', template)
		window.setTimeout(hideAlert, 4000)
	}
	const template = `<div id="alert" class="alert__${type}">${msg}</div>`;
	document.querySelector("body").insertAdjacentHTML('afterbegin', template)
	window.setTimeout(hideAlert, 4000)
}
if (location.href.includes("signup-login")) {
	{
		let objCal1 = new calendar.persian('persian-calendar');

		const fname_register = document.getElementById('fName_signup')
		const lname_register = document.getElementById("lName_signup")
		const email_register = document.getElementById("email_signup")
		const phoneNumber_register = document.getElementById("phone_number_signup")
		const passwordRegisteredUser = document.getElementById("password_signup")
		const passwordRegisteredUser_confirmation = document.getElementById("passwordConfrim_signup")
		const privacypolicy = document.getElementById("privacy_policy")
		const registerUser = document.getElementById("register-form");
		registerUser.addEventListener("submit", async (e) => {
			e.preventDefault();
			let errorValidationMessages = [];
			if (!fname_register.value.trim() || fname_register.value.trim() === '' || fname_register.value.trim() === null) errorValidationMessages.push("لطفا نام خود را وارد کنید.");
			if (!lname_register.value.trim() || lname_register.value.trim() === '' || lname_register.value.trim() === null) errorValidationMessages.push("لطفا نام خانوادگی خود را وارد کنید.");
			if (!email_register.value.trim() || email_register.value.trim() === '' || email_register.value.trim() === null) errorValidationMessages.push("لطفا ایمیل خود را وارد کنید.");
			if (!phoneNumber_register.value.trim() || phoneNumber_register.value.trim() === '' || phoneNumber_register.value.trim() === null) errorValidationMessages.push("لطفا شماره تلفن همراه خود را وارد کنید.");
			if (!passwordRegisteredUser.value.trim() || passwordRegisteredUser.value.trim() === '' || passwordRegisteredUser.value.trim() === null) errorValidationMessages.push("لطفا فیلد رمز را پر کنید.");
			if (passwordRegisteredUser.value.trim().length < 8) errorValidationMessages.push("رمز وارد شده حداقل باید متشکل از 8 حرف باشد.");
			if (!passwordRegisteredUser_confirmation.value.trim() || passwordRegisteredUser_confirmation.value.trim() === '' || passwordRegisteredUser_confirmation.value.trim() === null) errorValidationMessages.push("لطفا رمز خود را تأیید کنید.");
			if (errorValidationMessages.length > 1) return show_alert(errorValidationMessages, 'failed')
			const fname = fname_register.value;
			const lname = lname_register.value;
			const email = email_register.value;
			const phone_number = phoneNumber_register.value;
			const password = passwordRegisteredUser.value;
			const passwordConfrim = passwordRegisteredUser_confirmation.value;
			let privacy_policy;
			if (!privacypolicy.checked) {
				return show_alert("شما برای ثبت نام در سایت باید با تمام قوانین و مقررات موافقت کنید.", 'failed')
			} else {
				privacy_policy = privacypolicy.value;
			}
			const registerUserData = {
				fname,
				lname,
				email,
				phone_number,
				password,
				passwordConfrim,
				privacy_policy
			}
			signUp_login("/user/register", registerUserData);
		})
	}
	// ###################################################### signup-Content-Creators
	// ###################################################### signup-Content-Creators
	// ###################################################### signup-Content-Creators
	{
		const fname_register = document.getElementById('fName_signup_creator')
		const lname_register = document.getElementById("lName_signup_creator")
		const email_register = document.getElementById("email_signup_creator")
		const phoneNumber_register = document.getElementById("phone_number_signup_creator")
		const province = document.getElementById("province_signup_creator")
		const city = document.getElementById("city_signup_creator")
		const birthDate = document.getElementById("persian-calendar")
		const category_1 = document.getElementById("category_signup_creator_1")
		const category_2 = document.getElementById("category_signup_creator_2")
		const category_3 = document.getElementById("category_signup_creator_3")
		const passwordRegisteredUser = document.getElementById("password_signup_creator")
		const passwordRegisteredUser_confirmation = document.getElementById("passwordConfrim_signup_creator")
		const privacypolicy = document.getElementById("privacy_policy_creator");
		const registerUser = document.getElementById("register-creators-form");
		registerUser.addEventListener("submit", async (e) => {
			e.preventDefault();
			let categories = [];
			categories.push(category_1.value.trim())
			if (!category_2.value.includes("choose")) categories.push(category_2.value.trim());
			if (!category_3.value.includes("choose")) categories.push(category_3.value.trim());
			let errorValidationMessages = [];
			if (!fname_register.value.trim() || fname_register.value.trim() === '' || fname_register.value.trim() === null) errorValidationMessages.push("لطفا نام خود را وارد کنید.");
			if (!lname_register.value.trim() || lname_register.value.trim() === '' || lname_register.value.trim() === null) errorValidationMessages.push("لطفا نام خانوادگی خود را وارد کنید.");
			if (!email_register.value.trim() || email_register.value.trim() === '' || email_register.value.trim() === null) errorValidationMessages.push("لطفا ایمیل خود را وارد کنید.");
			if (!phoneNumber_register.value.trim() || phoneNumber_register.value.trim() === '' || phoneNumber_register.value.trim() === null) errorValidationMessages.push("لطفا شماره تلفن همراه خود را وارد کنید.");
			if (!passwordRegisteredUser.value.trim() || passwordRegisteredUser.value.trim() === '' || passwordRegisteredUser.value.trim() === null) errorValidationMessages.push("لطفا فیلد رمز را پر کنید.");
			if (passwordRegisteredUser.value.trim().length < 8) errorValidationMessages.push("رمز وارد شده حداقل باید متشکل از 8 حرف باشد.");
			if (!passwordRegisteredUser_confirmation.value.trim() || passwordRegisteredUser_confirmation.value.trim() === '' || passwordRegisteredUser_confirmation.value.trim() === null) errorValidationMessages.push("لطفا رمز خود را تأیید کنید.");
			if (!province.value.trim() || province.value.trim() === '' || province.value.trim() === null) errorValidationMessages.push("لطفا استان محل سکونت خود را وارد کنید.");
			if (!city.value.trim() || city.value.trim() === '' || city.value.trim() === null) errorValidationMessages.push("لطفا شهر محل سکونت خود را وارد کنید.");
			if (!birthDate.value.trim() || birthDate.value.trim() === '' || birthDate.value.trim() === null) errorValidationMessages.push("لطفا تاریخ تولد خود را وارد کنید.");
			if (categories.length < 1 || categories === null) errorValidationMessages.push("انتخاب حداقل یک دسته بندی لازم است.");
			if (errorValidationMessages.length > 1) return show_alert(errorValidationMessages, 'failed')
			const fname = fname_register.value.trim();
			const lname = lname_register.value.trim();
			const email = email_register.value.trim();
			const phone_number = phoneNumber_register.value.trim();
			const password = passwordRegisteredUser.value.trim();
			const passwordConfrim = passwordRegisteredUser_confirmation.value.trim();
			const province_value = province.value.trim();
			const city_value = city.value.trim();
			const birthDate_value = birthDate.value.trim();
			let privacy_policy;
			if (!privacypolicy.checked) {
				return show_alert("شما برای ثبت نام در سایت باید با تمام قوانین و مقررات موافقت کنید.", 'failed')
			} else {
				privacy_policy = privacypolicy.value;
			}
			const registerUserData = {
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
				privacy_policy
			}
			signUp_login("/user/register-content-creators", registerUserData);
		})
	}
	// login
	{
		const email_phoneNumber_login_field = document.getElementById("email_login");
		const password_login_field = document.getElementById("password_login");
		const rememberme_field = document.getElementById("remember");
		const login_btn = document.getElementById("login-form");
		login_btn.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (!email_phoneNumber_login_field.value.trim() || email_phoneNumber_login_field.value.trim() === '' || email_phoneNumber_login_field.value.trim() === null) return show_alert("برای ورود باید شماره تلفن یا ایمیل خود را وارد کنید.", 'failed')
			if (!password_login_field.value.trim() || password_login_field.value.trim() === '' || password_login_field.value.trim() === null) return show_alert("لطفا پسورد خود را وارد کنید.", 'failed')
			let rememberMe;
			if (rememberme_field.checked) {
				rememberMe = rememberme_field.value.trim();
			}
			const email_phoneNumber = email_phoneNumber_login_field.value;
			const password_login = password_login_field.value.trim();
			const loginData = {
				emailOrPhoneNumber: email_phoneNumber,
				password: password_login,
				rememberMe
			}
			signUp_login("/user/login", loginData);
		})
	}
}
const signUp_login = (url, formData) => {
	axios.post(url, formData)
		.then((res) => {
			show_alert(res.data.message, 'success');
			window.setTimeout(() => {
				hideAlert();
			}, 1500)
			window.location.assign("/")
		}).catch(err => {
			show_alert(err.response.data.message, 'failed');
		})
}