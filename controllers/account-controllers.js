require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

const bcrypt = require('bcrypt');
const saltRounds = 10;

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

    bcrypt.hash(password, saltRounds, addUserToDB);

    response.redirect("/log-in.html");
}

function addUserToDB(err, hash) {
    if (err) {
        console.log(`Unable to hash password. ERROR = ${err}`);
    }
    else {
        console.log(`HASH = ${hash}`);

        const uuidv1 = require('uuid/v1');
        const new_uuid = uuidv1();

        var sql = "INSERT INTO user_info (id, username, account_password, first_name, last_name, last_active, created_at) " +
                `VALUES ('${new_uuid}', '${username}', '${hash}', '${firstName}', '${lastName}', now(), now())`;

        console.log(`SQL QUERY STATEMENT: ${sql}`);

        pool.query(sql, function(err, result) {
            if (err) {
                console.log(`ERROR: ${err}`);
            }
            else {
                console.log(`RESULT: ${result}`);
            }
        });
    }
}

function logInUser(request, response) {
    console.log("Calling logInUser Funciton!");

    username = request.body.username;
    const password = request.body.password;
    
    console.log(`Seeking to log in user with username = ${username} and password = ${password}`);

    var sql = "SELECT first_name, last_name, account_password " +
                "FROM user_info " +
                `WHERE username='${username}'`;
    console.log(`QUERY = ${sql}`);

    pool.query(sql, function(err, result) {
        if(err) {
            console.log(`ERROR: ${err}`);
        }
        else {
            bcrypt.compare(password, result.rows[0].account_password, function (err, correct) {
                if(err) {
                    console.log(`ERROR: ${err}`);
                }
                else {
                    console.log(`RESULT OF BCRYPT COMPARE: ${correct}`);
                    if(correct) {
                        const jsonResponse = {
                            first: result.rows[0].first_name,
                            last: result.rows[0].last_name,
                            failed: false
                        };
                        console.log(`JSON: ${jsonResponse}`);
                        response.render("welcome", jsonResponse);
                    }
                    else {
                        const jsonResponse = {
                            failed: true
                        };
                        console.log(`JSON: ${jsonResponse}`);
                        response.status(404).send({ message: "Invalid username and/or password."});
                    }
                }
            });
        }
    });
}

module.exports = {
    createUser: createUser,
    logInUser: logInUser
}