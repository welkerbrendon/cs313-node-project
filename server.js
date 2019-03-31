const express = require("express");
const app = express();

const accountController = require("./controllers/account.js");
const activitiesController = require("./controllers/activities.js");

const port = process.env.PORT || 5000;

require('dotenv').config();
var session = require('express-session');

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({secret: "lksjdlfkop9792743"}));

app.post("/create-user", accountController.createUser);
app.post("/log-in", accountController.logInUser);
app.post("/add-day", activitiesController.postDay);

app.get("/activity-types", activitiesController.getActivityTypes);
app.get("/logged-in-status", accountController.checkIfLoggedIn);
app.get("/most-recent-day", activitiesController.getMostRecentDay);
app.get("/day", activitiesController.getDay);
app.get("/given-days", activitiesController.getGivenDays);

app.listen(port, function() {
    console.log("Listening on port: " + port);
});