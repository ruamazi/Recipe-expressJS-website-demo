require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const expressLayouts = require("express-ejs-layouts");
const routes = require("./server/routes/recipeRoutes");

const app = express();
const port = process.env.PORT || 3026;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("CookingBlogSecure"));
app.use(
  session({
    secret: "CookingBlogSecretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//routes
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
