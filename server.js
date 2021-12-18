const app = require("./app");
const mongoose = require("mongoose");
const config = require("config");
// ###################################################################### for development
const d = require("debug")("app:server");
const chalk = require('chalk');
const unhan = chalk.rgb(179, 36, 0).inverse;
if (!config.get("JwtSecret")) {
  console.log(" JWT SECRET must be set. ")
  process.exit(1)
}
// ###################################################################### handling exceptions
process.on("uncaughtException", (err) => {
  d(unhan(" UNHANDLED EXCEPTION "))
  console.log(err.stack)
  process.exit(1)
})
// ###################################################################### database connection
if(process.env.NODE_ENV === 'production') {
  let db_user = config.get("database.username");
  let db_pass = config.get("database.pass");
  let db_host = config.get("database.host");
  let db_port = config.get("database.port");
  let db_name = config.get("database.db");
  const DB = process.env.NODE_ENV === 'production' ? `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}` : 'mongodb://localhost/ronishka';
  mongoose
    .connect(DB, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => {
      console.log('Connected To MONGODB')
    })
    .catch((err) => {
      console.log("Couln't connect to the database !", err)
      process.exit(1)
    })
} else if (process.env.NODE_ENV === 'development') {
  mongoose.connect('mongodb://localhost:27017/ronishka',{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useNewUrlParser:true
  }).then(()=>console.log("Connected to mongodb ...")).catch(err=>console.log(`Could not connect to mongodb \n ${err}`))
}


// ###################################################################### server connection

let port = 9000
if(process.env.NODE_ENV === 'production'){
  // port = 
}

const server = app.listen(port, () => {
  console.log("running on port :" + port)
})

// ###################################################################### handling promise rejection
process.on("unhandledRejection", (err) => {
  d(unhan(" UNHANDLED PROMISE REJECTION "))
  console.log(err.stack)
  server.close(() => {
    process.exit(1)
  })
})