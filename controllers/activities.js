const model = require("../model/activities.js");

function getActivityTypes(request, response){
    model.getActivityTypeNames(function (err, result) {
        if (err) {
            response.json({message: "Error receiving activity type names."});
        }
        else {
            response.json(result);
        }
    })
}

function getMostRecentDay(request, response) {

}

function getGivenDay(request, response) {

}

function getWeek(request, response) {

}

function getMonth(request, response) {

}

module.exports = {
    getActivityTypes: getActivityTypes,
    getMostRecentDay: getMostRecentDay,
    getGivenDay: getGivenDay,
    getWeek: getWeek,
    getMonth: getMonth
};