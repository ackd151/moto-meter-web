const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const logger = require("morgan");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.engine("ejs", engine);
app.use(logger("tiny"));

app.get("/", (req, res, next) => {
  res.render("home");
});

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port: ${port}`));
