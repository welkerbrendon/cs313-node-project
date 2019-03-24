const model = require("../model/account.js");

var firstName = "";
var lastName = "";
var username = "";

function createUser(request, response){
    console.log("Calling createUser funciton!");
    firstName = request.body.first;
    lastName = request.body.last;
    username = request.body.username;
    const password = request.body.password;

    console.log(`first name = ${firstName}, last name = ${lastName}, username = ${username}, password = ${password}`);

    model.getUser(username, password, function(err, result){
        if (err) {
            model.addUser(username, password, firstName, lastName, function(err, result) {
                if (err) {
                    response.json({message: "Unexpected error occured, please try again."});
                }
                else {
                    response.json({redirect: "/log-in.html"});
                }
            });
        }
        else {
            response.json({message: "Unable to create account, please try a different username and/or password." });
        }
    });   
}

function logInUser(request, response) {
    console.log("Calling logInUser Funciton!");

    username = request.body.username;
    const password = request.body.password;
    
    console.log(`Seeking to log in user with username = ${username} and password = ${password}`);

    model.getUser(username, password, function (err, result) {
        if (err) {
            response.json({message: "Invalid username and/or password."});
        }
        else {
            response.json({redirect: "home.html"});
        }
    });
}

module.exports = {
    createUser: createUser,
    logInUser: logInUser
}