const nodemailer = require("nodemailer")
const config = require("config");
async function sendWelcomeEmail(emailData) {
    const transport = nodemailer.createTransport({
        host: `${config.get("email.host")}`,
        port: config.get("email.port"),
        auth: {
            user: `${config.get("email.auth.user")}`,
            pass: `${config.get("email.auth.pass")}`
        },
    });
    const options = {
        from: `${config.get("email.from")}`,
        to: emailData.email,
        subject: ` ${emailData.fname} عزیز به رونیشکا خوش آمدید. `,
        html: `<h3>ورود شما را به خانواده <a href="https://ronishka.com"> رونیشکا </a> خیر مقدم عرض می کنیم.</h3>`
    }
    await transport.sendMail(options);
}
async function sendResetPass(emailData) {
    const transport = nodemailer.createTransport({
        host: `${config.get("email.host")}`,
        port: `${config.get("email.port")}`,
        auth: {
            user: `${config.get("email.auth.user")}`,
            pass: `${config.get("email.auth.pass")}`
        },
    });
    const options = {
        from: `${config.get("email.from")}`,
        to: emailData.email,
        subject: "بازیابی رمز ورود به حساب کاربری.",
        html: `<h3>ورود شما را به خانواده <a href="https://ronishka.com"> بازیابی </a> خیر مقدم عرض می کنیم.</h3>`
    }
    await transport.sendMail(options);
}

exports.sendResetPass = sendResetPass;
exports.sendWelcomeEmail = sendWelcomeEmail;