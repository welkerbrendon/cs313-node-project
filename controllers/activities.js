const activitiesModel = require("../model/activities.js");

var attemptCount = 0;

function getActivityTypes(request, response){
    activitiesModel.getActivityTypeNames(function (err, result) {
        if (err) {
            response.json({message: "Error receiving activity type names."});
        }
        else {
            response.json(result);
        }
    })
}

function getMostRecentDay(request, response) {
    attemptCount++;

    var date = request.query.date;
    var userID = request.session.user.id;

    console.log(`Requesting day from model. date: ${date}, userID: ${userID}`);

    activitiesModel.getDay(date, userID, request.planner, function (err, result) {
        if (err) {
            if (attemptCount <= 365) {
                var dateObject = new Date(date);
                dateObject.setDate(dateObject.getDate() - 1);

                var dateString = dateObject.toISOString();
                dateString = dateString.split("T")[0];

                request.query.date = dateString;

                getMostRecentDay(request, response);
            }
            else {
                response.json(err);
            }
        }
        else {
            response.json({date: date, activities: result});
        }
    });
}

function getPlannedDay(request, response) {
    var userID = request.session.user.id;
    var date = request.query.date;

    console.log(`Request day from model. date: ${date}, userID: ${userID}`);

    activitiesModel.getDay(date, userID, true, function (err, result) {
        if (err) {
            response.json(err);
        }
        else {
            response.json({date: date, activities: result});
        }
    });
}

function getJournalDay(request, response) {
    var userID = request.session.user.id;
    var date = request.query.date;

    console.log(`Request day from model. date: ${date}, userID: ${userID}`);

    activitiesModel.getDay(date, userID, false, function (err, result) {
        if (err) {
            response.json(err);
        }
        else {
            response.json({date: date, activities: result});
        }
    });
}

function getGivenDays(request, response) {
    var startDate = request.query.startDate;
    var endDate = request.query.endDate;
    var userID = request.session.user.id;

    console.log(`Request set of days from model. startDate: ${startDate}, endDate: ${endDate}, userID: ${userID}`);

    activitiesModel.getGivenDays(startDate, endDate, userID, function (err, result) {
        if (err) {
            response.json(err);
        }
        else {
            response.json(result);
        }
    });
}

function postPlan(request, response) {
    console.log(`Request body received by activities controller postDay: ${JSON.stringify(request.body)}`);
    activitiesModel.postDayOfActivities(request.body, request.session.user.id, true, function(err, result) {
        if (err) {
            console.log(`Got following error from activities model: ${err}`);
            response.status(500).send(err);
        }
        else {
            response.json(result);
        }
    });
}

function postJournalEntry(request, response) {
    console.log(`Request body received by activities controller postDay: ${JSON.stringify(request.body)}`);
    activitiesModel.postDayOfActivities(request.body, request.session.user.id, false, function(err, result) {
        if (err) {
            console.log(`Got following error from activities model: ${err}`);
            response.status(500).send(err);
        }
        else {
            activitiesModel.postJournalEntry(request.body, request.session.user.id, function(err, secondResult) {
                if (err) {
                    return response.json({success: false});
                }
                else {
                    response.json({success: true, result: result + secondResult});
                }
            });
        }
    });
}

function editDay(request, response) {
    console.log("Successfully called editDay in controllers/activities.js");
    console.log(`Request body params: ${JSON.stringify(request.body)}`);

    console.log(`Calling model editDay with 
    
    activities:${JSON.stringify(request.body.activites)},
    
    userID: ${request.session.user.id},
    
    date:${request.body.date},
    
    `);
    activitiesModel.editDay(request.body.activities, request.session.user.id, request.body.date,  function (err, result) {
        if (err) {
            response.json({success: false});
        }
        else {
            if (request.body.entry) {
                activitiesModel.editJournalEntry(request.body.entry, request.session.user.id, request.body.date, function(err, result) {
                    if (err) {
                        response.json({success: false});
                    }
                    else {
                        response.json(result);
                    }
                });
            }
            else {
                response.json(result);
            }
        }
    })
}

function getActivityTypeId(request, response) {
    console.log(`Request activity type id with name: ${request.query.name}`);
    activitiesModel.getActivityTypeId(request.query.name, function (err, result) {
        if (err) {
            console.log(`ERROR: ${err}`);
            response.json(err);
        }
        else {
            response.json({type_id: result.id});
        }
    });
}

module.exports = {
    getActivityTypes: getActivityTypes,
    getMostRecentDay: getMostRecentDay,
    getGivenDays: getGivenDays,
    getPlannedDay: getPlannedDay,
    getJournalDay: getJournalDay,
    postPlan: postPlan,
    editDay: editDay,
    postJournalEntry: postJournalEntry,
    getActivityTypeId: getActivityTypeId
};