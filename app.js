/* Application imports */
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const logger = require("morgan");
const app = express();

/* Import Routes */
const profileRoutes = require("./routes/profiles");
const taskRoutes = require("./routes/tasks");

/* Model imports */
const Profile = require("./models/profile");
const Task = require("./models/task");

/* Set up db (local) */
mongoose.connect("mongodb://localhost:27017/motoMeterDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => console.log("MongoDB connected."));

/* Configure app */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.use(logger("tiny"));
app.use(methodOverride("_method"));

/* Mount Routes */
app.use("/profiles", profileRoutes);
app.use("/profiles/:profileId/tasks", taskRoutes);
// Home route
app.get("/", async (req, res, next) => {
  const profiles = await Profile.find({});
  console.log(profiles);
  res.render("home", { profiles });
});

/* Start server */
const { PORT = 3000 } = process.env;
app.listen(PORT, console.log(`Listening on port: ${PORT}`));
