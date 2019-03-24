const express = require("express");
const app = express();

const accountController = require("./controllers/account.js");
const activitiesController = require("./controllers/activities.js");

const port = process.env.PORT || 5000;

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post("/create-user", accountController.createUser);
app.post("/log-in", accountController.logInUser);

app.get("/activity-types", activitiesController.getActivityTypes);

app.listen(port, function() {
    console.log("Listening on port: " + port);
});