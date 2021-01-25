const app = require("./app");
const mongoose = require("mongoose");
const config = require("config");
// ###################################################################### for development
const d = require("debug")("app:server");
const chalk = require('chalk');
const er = chalk.rgb(255, 0, 0);
const unhan = chalk.rgb(179, 36, 0).inverse;
const suc = chalk.rgb(51, 204, 255);
if (!config.get("JwtSecret")) {
  d(unhan(" JWT SECRET must be set. "))
  process.exit(1)
}
// ###################################################################### handling exceptions
process.on("uncaughtException", (err) => {
  d(unhan(" UNHANDLED EXCEPTION "))
  d(er(err.stack))
  process.exit(1)
})
// ###################################################################### database connection
const db_user = config.get("database.username");
const db_pass = config.get("database.pass");
const db_host = config.get("database.host");
const db_port = config.get("database.port");
const db_name = config.get("database.db");
const DB = process.env.NODE_ENV === 'production' ? `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}` : 'mongodb://localhost/ronishka';
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    d(suc("Connected to the database mongodb..."))
  })
  .catch((err) => {
    d(er("Couln't connect to the database !", err))
    process.exit(1)
  })


// ###################################################################### server connection
const port = process.env.PORT || 9000;
const host = process.env.HOST || "localhost";
const server = app.listen(port, host, (err) => {
  d(suc(`server is running on port :${port} and on host :${host}`))
  if (err) {
    d(er("Couln't start the server something is wrong with the server.", err))
    process.exit(1)
  }
})

// ###################################################################### handling promise rejection
process.on("unhandledRejection", (err) => {
  d(unhan(" UNHANDLED PROMISE REJECTION "))
  d(er(err.stack))
  server.close(() => {
    process.exit(1)
  })
})