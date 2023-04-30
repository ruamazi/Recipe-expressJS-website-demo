const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI).then(console.log("connected to DB"));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

//Models
require("./Category");
require("./Recipe");
