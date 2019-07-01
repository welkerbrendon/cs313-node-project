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
    if (firstName == "" || lastName == "" || username == "" || password == "") {
        response.json({message: "*Unexpected error occured, please ensure you fill out all input fields.*"});
    }
    else {
        model.getUser(username, password, function(err, result){
            if (err) {
                model.addUser(username, password, firstName, lastName, function(err, result) {
                    if (err) {
                        response.json({message: "*Unexpected error occured, please try again.*"});
                    }
                    else {
                        response.json({redirect: "/log-in.html"});
                    }
                });
            }
            else {
                response.json({message: "*Unable to create account, please try a different username and/or password.*" });
            }
        });  
    } 
}

function logInUser(request, response) {
    console.log("Calling logInUser Funciton!");

    username = request.body.username;
    const password = request.body.password;
    
    console.log(`Seeking to log in user with username = ${username} and password = ${password}`);

    model.getUser(username, password, function (err, result) {
        if (err) {
            response.json({message: "*Invalid username and/or password.*"});
        }
        else {
            request.session.user = {username: username, firstName: result.first, lastName: result.last, id: result.id}; 
            response.json({redirect: "home.html"});
        }
    });
}

function checkIfLoggedIn(request, response) {
    console.log("Checking if user is logged in.");
    console.log(`Session: ${JSON.stringify(request.session)}`);
    if (request.session) {
        if(request.session.user) {
            response.json({loggedIn: true});
        }
        else {
            response.json({redirect: "log-in.html"});
        }
    }
    else {
        response.json({redirect: "log-in.html"});
    }
}

function signOut(request, response) {
    request.session.destroy();
    console.log(`Loggin user out. Session: ${JSON.stringify(request.session)}`);
    checkIfLoggedIn(request, response);
}

module.exports = {
    createUser: createUser,
    logInUser: logInUser,
    checkIfLoggedIn: checkIfLoggedIn,
    signOut: signOut
}