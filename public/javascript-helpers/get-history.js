function getHistory() {
    var radioButtons = document.getElementsByName("time-period");
    var selectedValue = null;
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedValue = radioButtons[i].value;
        }
    }
    console.log(`selected button value: ${selectedValue}`);

    var div = document.getElementById("result");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

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
    
    $.get("/most-recent-day", {date: dateString}, displayResults);
}

function getDay() {
    console.log("getDay() called.");

    var date = document.getElementById("day").value;
    console.log(`Date desired: ${date}`);

    $.get("/day", {date: date}, displayResults);
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

    $.get("/given-days", {startDate: startDate, endDate: endDate}, loopDaysToDisplay);
}

function loopDaysToDisplay(result, textStatus) {
    var date = result[0].given_day.split("T")[0];
    var formattedJSON = {date: date, activities: []};
    for (var i = 0, j = 0; i < result.length; i++, j++) {
        var temp = result[i];
        if (temp.given_day.split("T")[0] == date) {
            var activitiesJSON = {
                start_time: temp.start_time,
                end_time: temp.end_time,
                productive: temp.productive,
                type_name: temp.type_name,
                notes: temp.notes
            };
            formattedJSON.activities.push(activitiesJSON);
        }
        else {
            displayResults(formattedJSON, 200);
            j = -1;
            date = temp.given_day.split("T")[0];
            formattedJSON = {date: date, activities: []};
        }
    }

    displayResults(formattedJSON);
}

function displayResults(result, textStatus) {
    var div = document.getElementById("result");
    div.style.visibility = "visible";

    var monthNames = ["", "January", "February", "March", "April", "May",
                      "June", "July", "August", "September", "October",
                      "November", "December"];

    var paragraphElement = document.createElement("p");
    var headerElementDate = document.createElement("h2");
    var dateStringList = result.date.split("-");
    var readableDateString = `${monthNames[parseInt(dateStringList[1])]} ${dateStringList[2]}, ${dateStringList[0]}`
    headerElementDate.innerHTML = readableDateString;

    var table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("id", "results-table");

    table.appendChild(globalTableHeaders.cloneNode(true));

    activities = result.activities;
    for (var i = 0; i < activities.length; i++) {
        var singleActivity = activities[i];
        var tableRow = globalTableRow.cloneNode(true);
        var individualColumns = tableRow.children;
        for (var j = 0; j < individualColumns.length; j++) {
            var column = individualColumns[j];
            var id = column.getAttribute('id');
            var newInnerHTMLValue = id == "start-time-column" ? singleActivity.start_time :
                                    id == "end-time-column" ? singleActivity.end_time :
                                    id == "productive-column" ? singleActivity.productive :
                                    id == "activity-type-column" ? singleActivity.type_name :
                                    id == "notes-column" ? singleActivity.notes : null;
            
            column.setAttribute("value", newInnerHTMLValue);
            if (id == "start-time-column" || id == "end-time-column") {
                var time = newInnerHTMLValue.split(":");

                var hour = parseInt(time[0]);
                var timeOfDay = hour < 12 || hour == 24 ? " am" : " pm";
                hour = hour == 0 ? 12 :
                       hour > 12 ? hour - 12 : hour;

                newInnerHTMLValue = hour.toString() + ":" + time[1] + timeOfDay
            }
            column.innerHTML = newInnerHTMLValue;
            column.setAttribute("align", "center")
        }

        table.appendChild(tableRow);
    }

    paragraphElement.appendChild(headerElementDate);
    paragraphElement.appendChild(table);

    div.appendChild(paragraphElement);
}