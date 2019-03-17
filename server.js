const express = require("express");
const app = express();

const controller = require("./controllers/account-controllers.js");

const port = process.env.PORT || 5000;

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post("/create-user", controller.createUser);

app.post("/log-in", controller.logInUser);

app.listen(port, function() {
    console.log("Listening on port: " + port);
});