const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const chalk = require("chalk")
const red = chalk.red
const green = chalk.green
const yellow = chalk.yellow
const config = require("config")
const {
    Category
} = require("./models/categories")
const {
    Product
} = require("./models/products")
const {
    Content
} = require("./models/contents")
const {
    User
} = require("./models/users")
const {
    Review
} = require("./models/reviews")
const {
    TempUser
} = require("./models/temporaryUsers")
const argv = process.argv;

// const db_user = config.get("database.username");
// const db_pass = config.get("database.pass");
// const db_host = config.get("database.host");
// const db_port = config.get("database.port");
// const db_name = config.get("database.db");
// const DB = process.env.NODE_ENV === 'production' ? `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}` : 'mongodb://localhost/ronishka_db';
const DB = "mongodb://localhost/ronishka_db";
mongoose
    .connect(DB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log(yellow('mongodb connected ...')))
    .catch(() => {
        ERROR("Couldn't connect to mongodb ...")
        exit();
    })
const exit = () => {
    process.exit();
}
const importNewDocument = async (data, Collection) => {
    try {
        const NEW = await Collection.create(data)
        console.log(green("New product inserted to the database."))
        console.log("Data:", NEW)
        mongoose.disconnect().then(() => console.log("Mongodb disconnected."))
        exit();
    } catch (err) {
        ERROR("Something went wrong during inserting ...", err)
        exit();
    }
}
const deleteDocument = async (data, Collection) => {
    try {
        await Collection.deleteOne({
            _id: data
        })
        console.log(green(" Product deleted from the database."))
        mongoose.disconnect().then(() => console.log("Mongodb disconnected."))
        exit();
    } catch (err) {
        ERROR("Something went wrong during deleting ...", err)
        exit();
    }
}
const deleteDocuments = async (Collection) => {
    try {
        await Collection.deleteMany()
        console.log(green(" Products deleted from the database."))
        mongoose.disconnect().then(() => console.log("Mongodb disconnected."))
        exit();
    } catch (err) {
        ERROR("Something went wrong during deleting ...", err)
        exit();
    }
}
if (argv.includes('--help') || argv.includes('--h')) {
    console.log(`
    Hi Dear 

    ${chalk.blue.inverse(" -import ")} : To Insert One Document => ${chalk.yellow.inverse(" i.e. ")} : node seeder.js theNameOfYourJsonFile.json -import

    ${chalk.blue.inverse(" -i ")} : To Insert One Document => ${chalk.yellow.inverse(" i.e. ")} : node seeder.js theNameOfYourJsonFile.json -i 

    ${chalk.blue.inverse(" -many ")} : To Insert Sevaral Documents => ${chalk.yellow.inverse(" i.e. ")} : node seeder.js theNameOfYourJsonFile.json -i -many 

    ${chalk.blue.inverse(" -d ")} : To Delete One Document => ${chalk.yellow.inverse(" i.e. ")} : node seeder.js the-ID-of-Document -d 

    ${chalk.blue.inverse(" -delete ")}: To Delete One Document => ${chalk.yellow.inverse(" i.e. ")}: node seeder.js the-ID-of-Document - delete

    ${chalk.blue.inverse(" -all ")} : To Delete All Documents => ${chalk.yellow.inverse(" i.e. ")} : node seeder.js -d -all

    ${chalk.blue.inverse(" --h , --help ")} : To See Instructions => ${chalk.yellow.inverse(" i.e. ")} : node seeder.js --h
    `)
    exit();
}

const detectCollection = (data) => {
    if (argv.includes("--user") || argv.includes("--user")) {
        if (argv.includes("-i") || argv.includes("-import")) {
            importNewDocument(data, User);
        } else if (argv.includes("-d") || argv.includes("-delete")) {
            if (data === 'user') {
                deleteDocuments(User);
            } else {
                deleteDocument(data, User);
            }
        }
    } else if (argv.includes("--product") || argv.includes("--product")) {
        if (argv.includes("-i") || argv.includes("-import")) {
            importNewDocument(data, Product);
        } else if (argv.includes("-d") || argv.includes("-delete")) {
            if (data === 'product') {
                deleteDocuments(Product);
            } else {
                deleteDocument(data, Product);
            }
        }
    } else if (argv.includes("--content") || argv.includes("--content")) {
        if (argv.includes("-i") || argv.includes("-import")) {
            importNewDocument(data, Content);
        } else if (argv.includes("-d") || argv.includes("-delete")) {
            if (data === 'content') {
                deleteDocuments(Content);
            } else {
                deleteDocument(data, Content);
            }
        }
    } else if (argv.includes("--category") || argv.includes("--category")) {
        if (argv.includes("-i") || argv.includes("-import")) {
            importNewDocument(data, Category);
        } else if (argv.includes("-d") || argv.includes("-delete")) {
            if (data === 'category') {
                deleteDocuments(Category);
            } else {
                deleteDocument(data, Category);
            }
        }
    } else if (argv.includes("--review") || argv.includes("--review")) {
        if (argv.includes("-i") || argv.includes("-import")) {
            importNewDocument(data, Review);
        } else if (argv.includes("-d") || argv.includes("-delete")) {
            if (data === 'review') {
                deleteDocuments(Review);
            } else {
                deleteDocument(data, Review);
            }
        }
    } else if (argv.includes("--tempuser") || argv.includes("--tempuser")) {
        if (argv.includes("-i") || argv.includes("-import")) {
            importNewDocument(data, TempUser);
        } else if (argv.includes("-d") || argv.includes("-delete")) {
            if (data === 'tempuser') {
                deleteDocuments(TempUser);
            } else {
                deleteDocument(data, TempUser);
            }
        }
    }
}
if (argv.includes("-i") || argv.includes("-d") || argv.includes("-import") || argv.includes("-delete")) {
    let rawData;
    let jsonData;
    let fileName;
    if (!argv[2].includes(".json") && argv.includes("-i") && argv.includes("-import") && !argv.includes("-d")) {
        ERROR("Please make sure you entered the file name.")
        exit();
    } else if (argv.includes("-i") || argv.includes("-import")) {
        rawData = fs.readFileSync(path.join(__dirname, 'data', argv[2]), 'utf-8')
        jsonData = JSON.parse(rawData)
        fileName = jsonData;
        console.log(green("RESULTS FOUND : ", fileName.length))
        detectCollection(fileName);
    } else if (argv.includes("-d") || argv.includes("-delete")) {
        if (argv.includes("-all")) {
            if (argv.includes("--product")) {
                fileName = 'product';
            } else if (argv.includes("--user")) {
                fileName = 'user';
            } else if (argv.includes("--content")) {
                fileName = 'content';
            } else if (argv.includes("--tempuser")) {
                fileName = 'tempuser';
            } else if (argv.includes("--review")) {
                fileName = 'review';
            } else if (argv.includes("--category")) {
                fileName = 'category';
            }
            detectCollection(fileName);
        } else {
            if (mongoose.isValidObjectId(argv[2])) {
                fileName = argv[2];
                detectCollection(fileName);
            } else {
                ERROR("Entered ID is not a valid objectId .")
            }
        }
    }
} else {
    ERROR("Please use the Correct argvs to triger the Correct functionallity.\nUse --help to see the instructions. ")
    exit();
}

function ERROR(message, err) {
    console.log(red("ERROR : ", message));
    if (err) console.error(err)
    exit();
}
