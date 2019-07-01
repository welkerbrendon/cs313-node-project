function getHistory(planner, edit) {
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
            getMostRecentDay(planner, edit);
            break;
        case "day":
            getDay(planner, edit);
            break;
        case "week":
            getWeek(planner, edit);
            break;
        case "month":
            getMonth(planner, edit);
            break;
        case "custom":
            getCustom(planner, edit);
            break;
    }
}

function getMostRecentDay(planner, edit) {
    console.log("getMostRecentDay() called.");

    var date = new Date();
    var dateString = date.toISOString();
    dateString = dateString.split("T")[0];
    
    if (planner) {
        $.get("/most-recent-day", {date: dateString}, function (result, textStatus) {
            if (textStatus == "success") {
                displayResults(result, planner, edit);
            }
        });
    }
}

function getDay(planner, edit) {
    console.log("getDay() called.");

    var div = document.getElementById("result");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    var date = edit ? document.getElementById("date-to-edit").value : document.getElementById("day").value;
    console.log(`Date desired: ${date}`);
    if (planner) {
        $.get("/planned-day", {date: date}, function (result, textStatus) {
            if (textStatus == "success") {
                displayResults(result, planner, edit);
            }
        });
    }
    else {
        $.get("/journal-day", {date: date}, function (result, textStatus) {
            if (textStatus == "success") {
                displayResults(result, planner, edit);
            }
        });
    }
}

function getWeek(planner, edit) {
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

    getTimePeriod(startDateString, endDateString, planner, edit);
}

function getMonth(planner, edit) {
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

    getTimePeriod(startDate, endDate, planner, edit);
}

function getCustom(planner, edit) {
    console.log("getCustom() called.");

    var startDate = document.getElementById("start-date").value;
    var endDate = document.getElementById("end-date").value;
    console.log(`Desired startDate: ${startDate}, desired endDate: ${endDate}`);

    getTimePeriod(startDate, endDate, planner);
}

function getTimePeriod(startDate, endDate, planner) {
    console.log(`getTimePeriod called. startDate: ${startDate}, endDate: ${endDate}.`);

    $.get("/given-days", {startDate: startDate, endDate: endDate}, function (result, rextStatus) {
        if (textStatus == 200) {
            loopDaysToDisplay(result, planner, edit);
        }
    });
}

function loopDaysToDisplay(result, planner, edit) {
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
            displayResults(formattedJSON, planner, edit);
            j = -1;
            date = temp.given_day.split("T")[0];
            formattedJSON = {date: date, activities: []};
        }
    }

    displayResults(formattedJSON, planner, edit);
}

function displayResults(result, planner, edit) {
    var div = document.getElementById("result");

    if (edit) {
        var addRow = document.getElementById("addRow").cloneNode(true);
        addRow.setAttribute("onclick", `addRow('results-table', ${planner})`);
        div.appendChild(addRow);

        var deleteRow = document.getElementById("deleteRow").cloneNode(true);
        deleteRow.setAttribute("onclick", `deleteRow('results-table', ${result.activities.length})`);
        div.appendChild(deleteRow);
    }

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
        tableRow.setAttribute("value", singleActivity.id);
        if (edit) {
            tableRow.setAttribute("name", "table-rows");
        }
        var individualColumns = tableRow.children;
        for (var j = 0; j < individualColumns.length; j++) {
            var column = individualColumns[j];
            var id = column.getAttribute('id');
            var value = id == "start-time-column" ? singleActivity.start_time :
                        id == "end-time-column" ? singleActivity.end_time :
                        id == "productive-column" ? singleActivity.productive :
                        id == "activity-type-column" ? singleActivity.type_name :
                        id == "notes-column" ? singleActivity.notes : null;
            value = value == "undefined" ? "" : value
            if (edit) {
                setInputElements(column, id, value, i);
            }
            else {
                column.setAttribute("value", value);
                if (id == "start-time-column" || id == "end-time-column") {
                    var time = value.split(":");

                    var hour = parseInt(time[0]);
                    var timeOfDay = hour < 12 || hour == 24 ? " AM" : " PM";
                    hour = hour == 0 ? 12 :
                        hour > 12 ? hour - 12 : hour;

                    value = hour.toString() + ":" + time[1] + timeOfDay;
                }
                column.innerHTML = value;
                column.setAttribute("align", "center");
            }
        }

        table.appendChild(tableRow);
    }

    paragraphElement.appendChild(headerElementDate);
    paragraphElement.appendChild(table);

    div.appendChild(paragraphElement);

    if (!planner) {
        var entry = document.getElementById("journal-entry").cloneNode(true);
        entry.children[2].value = result.activities[0].entry;
        entry.setAttribute("id", "result-entry");
        entry.style.visibility = "visible";
        if (!edit) {
            entry.children[2].readOnly = true;
        }
        div.appendChild(entry);
    }

    if (edit) {
        var submit = document.getElementById("submit").cloneNode(true);
        if (planner) {
            submit.setAttribute("onclick", `submitPlan(true, ${result.date})`);
        }
        else {
            submit.setAttribute("onclick", `submitJournal(true, ${result.date})`);
        }
        div.appendChild(submit);

        var clear = document.getElementById("clear").cloneNode(true);
        clear.setAttribute("onclick", "clearTable('results-table')");
        div.appendChild(clear);
    }
}

function setInputElements(column, id, value, i) {
    if (id == "start-time-column" || id == "end-time-column") {
        var time = value.split(":");

        var hour = parseInt(time[0]);
        var timeOfDay = hour < 12 || hour == 24 ? "AM" : "PM";
        hour = hour == 0 ? 12 :
            hour > 12 ? hour - 12 : hour;

        var timeValue = hour.toString() + ":" + time[1];
        column.children[0].value = timeValue;
        column.children[1].value = timeOfDay;
    }
    else if (id == "productive-column") {
        column.children[0].setAttribute("name", (column.children[0].getAttribute("name") + i));
        column.children[2].setAttribute("name", (column.children[2].getAttribute("name") + i));

        if (value) {
            column.children[0].checked = true;
        }
        else {
            column.children[2].checked = true;
        }
    }
    else if (id == "notes-column") {
        column.children[0].value = value;
    }
    else if (id == "activity-type-column") {
        addActivityTypes(column.children[0]);
        $.get("/activity-type/id", {name: value}, function (result, status) {
            if (status == "success") {
                column.children[0].value = result.type_id;
            }
        });
    }
}