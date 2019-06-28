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

    var newActivities = [];
    var existingActivities = [];
    for (var i = 0; i < request.body.activities.length; i++) {
        var tempActivity = request.body.activities[i];
        if (tempActivity.id == "table-row") {
            newActivities.push(tempActivity);
        }
        else {
            existingActivities.push(tempActivity);
        }
    }
    console.log(`newActivities: ${JSON.stringify(newActivities)}`);
    console.log(`existingActivities: ${JSON.stringify(existingActivities)}`);

    activitiesModel.editDay(existingActivities, function (err, result) {
        if (err) {
            console.log(`ERROR: ${err}`);
            response.status(500).send("Unable to edit day.");
        }
        else {
            activitiesModel.getDayId(request.session.user.id, request.body.date, function (err, result) {
                if (err) {
                    console.log(`ERROR: ${err}`);
                    response.status(500).send("Unable to get day to add activities to.");
                }
                else {
                    console.log(`day id result: ${JSON.stringify(result)}`);
                    activitiesModel.addActivities(newActivities, request.session.user.id, result.id, function (err, result) {
                        if (err) {
                            console.log(`ERROR: ${err}`);
                            response.status(500).send("Unable to add activities to day.");
                        }
                        else {
                            response.json({success: true});
                        }
                    })
                }
            });
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
    postJournalEntry: postJournalEntry
};