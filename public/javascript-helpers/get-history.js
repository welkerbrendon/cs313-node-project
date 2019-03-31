function getHistory() {
    var radioButtons = document.getElementsByName("time-period");
    var selectedValue = null;
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedValue = radioButtons[i].value;
        }
    }

    console.log(`selected button value: ${selectedValue}`);

    switch (selectedValue) {
        case "most-recent":
            getMostRecentDay();
            break;
        case "day":
            getDay();
            break;
        case "week":
            getWeek();
            break;
        case "month":
            getMonth();
            break;
        case "custom":
            getCustom();
            break;
    }
}

function getMostRecentDay() {
    console.log("getMostRecentDay() called.");

    var date = new Date();
    var dateString = date.toISOString();
    dateString = dateString.split("T")[0];
    
    $.get("/most-recent-day", {date: dateString}, function (result, textStatus) {
        console.log(JSON.stringify(result));
    });
}

function getDay() {
    console.log("getDay() called.");

    var date = document.getElementById("day").value;
    console.log(`Date desired: ${date}`);

    $.get("/day", {date: date}, function (result, textStatus) {
        console.log(JSON.stringify(result));
    });
}

function getWeek() {
    console.log("getWeek() called.");

    var startDate = new Date(document.getElementById("day").value);
    startDate.setDate(startDate.getDate());
    var endDate = new Date(startDate.valueOf());
    endDate.setDate(endDate.getDate() + 6);

    var startDateString = startDate.toISOString();
    startDateString = startDateString.split("T")[0];

    var endDateString = endDate.toISOString();
    endDateString = endDateString.split("T")[0];

    console.log(`desired startDate: ${startDateString}, calculated endDate: ${endDateString}`);

    getTimePeriod(startDateString, endDateString);
}

function getMonth() {
    console.log("getMonth() called.");

    var monthDate = document.getElementById("month").value;

    var startDate = monthDate + "-01";
    var endDate = "";

    var monthNumber = parseInt(monthDate.split("-")[1]);
    switch (monthNumber) {
        case 2:
            endDate = monthDate + "-28";
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            endDate = monthDate + "-30";
            break;
        default:
            endDate = monthDate + "-31";
            break;
    }

    console.log(`Month desired: ${month}`);
    console.log(`Desired startDate: ${startDate}, desired endDate: ${endDate}`);

    getTimePeriod(startDate, endDate);
}

function getCustom() {
    console.log("getCustom() called.");

    var startDate = document.getElementById("start-date").value;
    var endDate = document.getElementById("end-date").value;
    console.log(`Desired startDate: ${startDate}, desired endDate: ${endDate}`);

    getTimePeriod(startDate, endDate);
}

function getTimePeriod(startDate, endDate) {
    console.log(`getTimePeriod called. startDate: ${startDate}, endDate: ${endDate}.`);

    $.get("/given-days", {startDate: startDate, endDate: endDate}, function (result, textStatus) {
        console.log(JSON.stringify(result));
    });
}