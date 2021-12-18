const error = require('./middlewares/errors')
const config = require("config")
const ERR = require("./utilities/ERR")
const express = require("express")
const fileupload = require("express-fileupload")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const hpp = require("hpp")
const xss = require("xss-clean")
const sanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const path = require('path')
const compression = require("compression")
const mongoose = require("mongoose")
// ###################################################################### routes
const pages = require("./routes/pages")
const user = require("./routes/users")
const categories = require("./routes/categories")
const contentOperations = require("./routes/contents")
const content = require("./routes/content-creators")
const search = require("./routes/search")
const product = require("./routes/products")
const reviews = require("./routes/reviews")
const ads = require("./routes/ads")
const messages = require("./routes/messages")
// ###################################################################### development settings
const fs = require("fs")
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags:'a'})
const app = express()
if (process.env.NODE_ENV === 'production') {
	const morgan = require("morgan")
	app.use(morgan("combined",{stream:accessLogStream}))
	app.use(morgan("dev"))
}
app.use(fileupload())
app.get("/accepting-policy-confirmed", (req, res) => {
	res.cookie("policy", "accpeted");
	res.send({
		cookie_accepted: "yes"
	})
})
let sessOptions = {
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 10 * 24 * 60 * 60 * 1000
	}),
	name: 'rid',
	secret: `${config.get("session.secret")}`,
	resave: false,
	sameSite: true,
	saveUninitialized: true,
	cookie: {
		// secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 10 * 24 * 60 * 60 * 1000
	}
}
app.use(session(sessOptions))
app.use('/', (req, res, next) => {
	if (req.session.user && req.headers.cookie.includes("x-jwt-token")) {
		req.session.loggedIn = 1;
	} else {
		req.session.loggedIn = 0;
	}
	
    
	if(!req.session.ratedContents) req.session.ratedContents = []
	if(!req.session.contentImages) req.session.contentImages = []
	if(!req.session.pathToSave) req.session.pathToSave = ''
	if(!req.session.content_id) req.session.content_id = ''
	if(!req.session.imageName) req.session.imageName = ''
	if(!req.session.contentFiles) req.session.contentFiles = []
	if(!req.session.pathToFileLocation_temp) req.session.pathToFileLocation_temp = ''
	if(!req.session.fileName_temp) req.session.fileName_temp = ''
	next();
})
// ###################################################################### view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
// ###################################################################### static files
app.use(express.static(path.join(__dirname, "public")))
// ###################################################################### parsing
app.use(express.json({
	limit: 5242880
}))
app.use(express.urlencoded({
	extended: false
}))
// ###################################################################### security
const limitter = rateLimit({
	max: 200,
	windowMs: 60 * 60 * 1000,
	message: "Too many request please try an hour later"
})
app.use(xss())
app.use(helmet())
app.use(hpp())
app.use(sanitize())
app.use('/', limitter)
app.use(compression());
// ###################################################################### handling routes

app.use("/", pages);
app.use("/", reviews)
app.use("/user", user);
app.use("/new", categories);
app.use("/new", content);
app.use("/new", product);
app.use("/new", ads);
app.use("/new", messages);
app.use("/", contentOperations);
app.use("/", search)

app.all('*', (req, res, next) => {
	return next(new ERR(`این مسیر  یافت نشد.https://ronishka.com${req.originalUrl}`, 404))
})
// ###################################################################### handling errors
app.use(error)
module.exports = app;