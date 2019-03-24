require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

const bcrypt = require('bcrypt');
const saltRounds = 10;

function addUser(username, password, firstName, lastName, callback) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            console.log(`Unable to hash password. ERROR: ${err}`);
            callback(err, null);
        }
        else {
            const uuidv1 = require('uuid/v1');
            const new_uuid = uuidv1();

            var sql = "INSERT INTO user_info (id, username, account_password, first_name, last_name, last_active, created_at) " +
                    `VALUES ('${new_uuid}', '${username}', '${hash}', '${firstName}', '${lastName}', now(), now())`;

            console.log(`SQL QUERY STATEMENT: ${sql}`);

            pool.query(sql, function(err, result) {
                if (err) {
                    console.log(`Error durring query. ERROR: ${err}`);
                    callback(err, null);
                }
                else {
                    console.log(`Successfully added user to db. RESULT: ${result}`);
                    callback(null, result);
                }
            });
        }
    });
}

function getUser(username, password, callback){
    var sql = "SELECT first_name, last_name, account_password " +
                "FROM user_info " +
                `WHERE username='${username}'`;
    console.log(`QUERY = ${sql}`);

    pool.query(sql, function(err, result) {
        if(err) {
            callback(err, result);
        }
        else {
            try {
                bcrypt.compare(password, result.rows[0].account_password, function (err, correct) {
                    if(err) {
                        callback(err, result);
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
                            callback(null, jsonResponse);
                        }
                        else {
                            const jsonResponse = {
                                failed: true
                            };
                            console.log(`JSON: ${jsonResponse}`);
                            callback("No user", jsonResponse);
                        }
                    }
                });
            }
            catch (err) {
                callback(err, null);
            }
        }
    });
}

module.exports = {
    addUser: addUser,
    getUser: getUser
}