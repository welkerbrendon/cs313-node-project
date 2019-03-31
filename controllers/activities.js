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

    activitiesModel.getDay(date, userID, function (err, result) {
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
            response.json({date: date, results: result});
        }
    });
}

function getDay(request, response) {
    var userID = request.session.user.id;
    var date = request.query.date;

    console.log(`Request day from model. date: ${date}, userID: ${userID}`);

    activitiesModel.getDay(date, userID, function (err, result) {
        if (err) {
            response.json(err);
        }
        else {
            response.json(result);
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

function postDay(request, response) {
    console.log(`Request body received by activities controller postDay: ${JSON.stringify(request.body)}`);
    activitiesModel.postDayOfActivities(request.body, request.session.user.id, function(err, result) {
        if (err) {
            console.log(`Got following error from activities model: ${err}`);
            response.status(500).send(err);
        }
        else {
            response.json(result);
        }
    });
}

module.exports = {
    getActivityTypes: getActivityTypes,
    getMostRecentDay: getMostRecentDay,
    getGivenDays: getGivenDays,
    getDay: getDay,
    postDay: postDay
};