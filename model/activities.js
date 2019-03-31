const uuidv1 = require('uuid/v1');

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg');
const pool = new Pool({connectionString: connectionString});

function getActivityTypeNames(callback) {
    var sql = "SELECT type_name, id FROM activity_type WHERE universal='t'";
    
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

function postDayOfActivities(requestJSON, userID, callback) {
    console.log(`activities model postDayOfActivities received: ${JSON.stringify(requestJSON)}`);

    const dayID = `${userID}-${requestJSON.date}`;
    const daySQL = `INSERT INTO day (id, given_day, user_id, last_updated, created_at)
                 VALUES ('${dayID}', '${requestJSON.date}', '${userID}', now(), now())`;

    console.log(`daySQL: ${daySQL}`);

    pool.query(daySQL, function(err, result) {
        if (err) {
            callback("Day already exists.", null);
        }
        else {
            addDays(requestJSON.activities, userID, dayID, callback);
        }
    });
}

function addDays(activities, userID, dayID, callback) {
    console.log(`addDays called with: activities=${JSON.stringify(activities)}`);
    
    if (activities.length <= 0) {
        console.log(`activieis.length=${activities.length}, therefore ending loop.`);
        callback(null, {success: true});
    }
    else {
        var activityData = activities[activities.length - 1];
        activities.splice(activities.length - 1);

        var new_uuid = uuidv1();
        var activitySQL = `INSERT INTO activity (id, user_id, day_id, activity_type_id, start_time, end_time, productive, notes, last_updated, created_at)
                           VALUES ('${new_uuid}', '${userID}', '${dayID}', '${activityData.activityType}', '${activityData.startTime}', '${activityData.endTime}', '${activityData.productive}', '${activityData.notes}', now(), now())`;
        
        console.log(`activitySQL: ${activitySQL}`);
        pool.query(activitySQL, function(err, result) {
            if (err) {
                console.log(`ERROR when adding activity`);
                callback("Unable to put an activity in table.", null);
            }
            else {
                console.log("Calling self");
                addDays(activities, userID, dayID, callback);
            }
        });
    }
}

function getDay(date, userID, callback) {
    console.log(`Received request to get date. Date: ${date}, userID: ${userID}`);

    var sql = `SELECT activity.id, activity_type.type_name, activity.start_time, activity.end_time, activity.productive, activity.notes
               FROM activity
               INNER JOIN activity_type
               ON activity_type.id=activity.activity_type_id
               INNER JOIN day
               ON day.id=activity.day_id
               AND day.given_day='${date}'
               AND activity.user_id='${userID}'`;

    console.log(`getDay SQL statement: ${sql}`);

    pool.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        }
        else {
            if(result.rowCount == 0){
                callback("Nothing found.", null);
            }
            else {
                callback(null, result.rows);
            }
        }
    });
}

function getGivenDays(startDate, endDate, userID, callback) {
    console.log(`Received request to get set of dates. startDate: ${startDate}, endDate: ${endDate}, userID: ${userID}`);

    var sql = `SELECT activity.id, activity_type.type_name, activity.start_time, activity.end_time, activity.productive, activity.notes
               FROM activity
               INNER JOIN activity_type
               ON activity_type.id=activity.activity_type_id
               INNER JOIN day
               ON day.id=activity.day_id
               AND day.given_day>='${startDate}'
               AND day.given_day<='${endDate}'
               AND activity.user_id='${userID}'`
    
    console.log(`getGivenDats SQL statement: ${sql}`);

    pool.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        }
        else {
            if(result.rowCount == 0){
                callback("Nothing found.", null);
            }
            else {
                callback(null, result.rows);
            }
        }
    });
}

module.exports = {
    getActivityTypeNames: getActivityTypeNames,
    postDayOfActivities: postDayOfActivities,
    getDay: getDay,
    getGivenDays: getGivenDays
};