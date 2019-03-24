require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

function getActivityTypeNames(callback) {
    var sql = "SELECT type_name FROM activity_type WHERE universal='t'";
    
    pool.query(sql, function(err, result) {
        if (err) {
            console.log(`Error querying for activity types. ERROR: ${err}`);
            callback(err, null);
        }
        else {
            callback(null, result.rows);
        }
    });
}

module.exports = {
    getActivityTypeNames: getActivityTypeNames,
};