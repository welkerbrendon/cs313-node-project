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

function postDayOfActivities(requestJSON, userID, plan, callback) {
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
            addActivities(requestJSON.activities, userID, dayID, plan, callback);
        }
    });
}

function postJournalEntry(requestJSON, userID, callback) {
    console.log(`activities model postJournalEntry received: ${JSON.stringify(requestJSON)}`);

    const dayID = `${userID}-${requestJSON.date}`;
    const entrySQL = `INSERT INTO journal_entry (user_id, day_id, entry, created_at, last_updated)
                      VALUES ('${userID}', '${dayID}', '${requestJSON.entry}', now(), now())`;
    
    console.log(`entrySQL: ${entrySQL}`);

    pool.query(entrySQL, function (err, result) {
        if (err) {
            console.log(`postJournalEntry error: ${err}`);
            callback(err, null);
        }
        else {
            console.log(`Successfull in postJournalEntry`);
            callback(null, result);
        }
    });
}

function addActivities(activities, userID, dayID, plan, callback) {
    console.log(`addDays called with: activities=${JSON.stringify(activities)}`);
    
    if (activities.length <= 0) {
        console.log(`activieis.length=${activities.length}, therefore ending loop.`);
        callback(null, {success: true});
    }
    else {
        var activityData = activities[activities.length - 1];
        activities.splice(activities.length - 1);

        var new_uuid = uuidv1();
        var activitySQL = plan ? `INSERT INTO activity (id, user_id, day_id,
            activity_type_id, start_time, 
            end_time, notes, 
            plan, last_updated, created_at)
            VALUES ('${new_uuid}', '${userID}', '${dayID}', 
            '${activityData.type_id}', '${activityData.start_time}', 
            '${activityData.end_time}', 
            '${activityData.notes}', '${plan}', 
            now(), now())` : 
                            `INSERT INTO activity (id, user_id, day_id,
                                                 activity_type_id, start_time, 
                                                 end_time, productive, notes, 
                                                 plan, last_updated, created_at)
                            VALUES ('${new_uuid}', '${userID}', '${dayID}', 
                                   '${activityData.type_id}', '${activityData.start_time}', 
                                   '${activityData.end_time}', '${activityData.productive}', 
                                   '${activityData.notes}', '${plan}', 
                                    now(), now())`;
        
        console.log(`activitySQL: ${activitySQL}`);
        pool.query(activitySQL, function(err, result) {
            if (err) {
                console.log(`ERROR when adding activity. Following error was given: ${err}`);
                callback("Unable to put an activity in table.", null);
            }
            else {
                console.log("Calling self");
                addActivities(activities, userID, dayID, plan, callback);
            }
        });
    }
}

function getDay(date, userID, plan, callback) {
    console.log(`Received request to get date. Date: ${date}, userID: ${userID}`);
    
    var sql = `SELECT activity.id, activity_type.type_name, 
                      activity.start_time, activity.end_time, 
                      activity.productive, activity.notes,
                      je.entry
               FROM activity
               INNER JOIN activity_type
               ON activity_type.id=activity.activity_type_id
               INNER JOIN day
               ON day.id=activity.day_id
               AND day.user_id=activity.user_id
               INNER JOIN journal_entry je
               ON je.day_id=day.id
               AND je.user_id=activity.user_id
               WHERE activity.user_id='${userID}'
               AND activity.plan='${plan}'
               AND day.given_day='${date}'
               ORDER BY activity.start_time ASC`;

    console.log(`getDay SQL statement: ${sql}`);

    pool.query(sql, function (err, result) {
        if (err) {
            console.log(`ERROR getDay: ${err}`)
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

function getGivenDays(startDate, endDate, userID, plan, callback) {
    console.log(`Received request to get set of dates. startDate: ${startDate}, endDate: ${endDate}, userID: ${userID}`);

    var sql = `SELECT day.given_day, activity.id, activity_type.type_name, activity.start_time, activity.end_time, activity.productive, activity.notes
               FROM activity
               INNER JOIN activity_type
               ON activity_type.id=activity.activity_type_id
               INNER JOIN day
               ON day.id=activity.day_id
               AND day.given_day>='${startDate}'
               AND day.given_day<='${endDate}'
               AND activity.user_id='${userID}'
               AND activity.plan='${plan}'`
    
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

function editDay(request, callback) {
    console.log("Successfully called editDay in model/activities.js");
    console.log(`Request received in activities model editDay: ${JSON.stringify(request)}`);

    var activity = request[request.length - 1];
    request.splice(request.length - 1);
    if (activity != null) {
        var sql = `UPDATE activity
                    SET activity_type_id='${activity.type_id}', 
                        start_time='${activity.start_time}',
                        end_time='${activity.end_time}',
                        productive='${activity.productive}',
                        notes='${activity.notes}',
                        last_updated=now()
                    WHERE id='${activity.id}'`;
        console.log(`editDay SQL statement: ${sql}`);
         
        pool.query(sql, function (err, result) {
            if (err) {
                console.log(`ERROR: ${err}`);
                callback(err, null);
            }
            else {
                editDay(request, callback);
            }
        });
    }
    else {
        if (request.length > 0) {
            editDay(request, callback);
        }
        else {
            callback(null, {success: true});
        }
    }
}

function getDayId(userID, given_day, callback) {
    console.log(`Retreiving day_id.`);

    var sql = `SELECT id 
               FROM day 
               WHERE user_id='${userID}' 
               AND given_day='${given_day}'`;

    console.log(`getDayId SQL Statement: ${sql}`);
    
    pool.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, result.rows[0]);
        }
    });
}

// function postJournalEntry(userID, given_day, entry, callback) {
//     console.log(`adding new journal entry.`);

//     const journalEntrySQL = `INSERT INTO journal_entry
//                              (user_id, 
//                               day_id, 
//                               entry, 
//                               created_at, 
//                               last_updated)
//                              VALUES
//                              (${userID}, 
//                               SELECT id FROM day WHERE given_day=${given_day} AND user_id=${user_id},
//                               ${entry},
//                               now(),
//                               now())`;

//     console.log(`inser into journal_entry table statement: ${journalEntrySQL}`);

//     pool.query(journalEntrySQL, function (err, result) {
//         if (err) {
//             callback(err, null);
//         }
//         else {
//             callback(null, {success: true});
//         }
//     });
// }

module.exports = {
    getActivityTypeNames: getActivityTypeNames,
    postDayOfActivities: postDayOfActivities,
    getDay: getDay,
    getGivenDays: getGivenDays,
    editDay: editDay,
    addActivities: addActivities,
    getDayId: getDayId,
    postJournalEntry: postJournalEntry
};