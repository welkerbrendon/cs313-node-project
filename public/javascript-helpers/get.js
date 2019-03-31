window.onload = setUp;

var activityTypes = null;
var globalTableHeaders = null;
var globalTableRow = null;

function setUp() {
    getLoggedInStatus();
    getActivityTypes();
    setGlobalTableRow();
    setGlobalTableHeaders();
}

//server side
function getLoggedInStatus() {
    $.get("/logged-in-status", function (result, textStatus) {
        console.log(JSON.stringify(result));
        if(result.redirect) {
            window.location.href = result.redirect;
        }
    });
}

function getActivityTypes() {
    $.get("/activity-types", function(result, textStatus) {
        console.log(JSON.stringify(result));
        activityTypes = result;
    });
}

//client side
function setGlobalTableHeaders() {
    globalTableHeaders = document.getElementById("table-headers").cloneNode(true);
}

function setGlobalTableRow() {
    globalTableRow = document.getElementById("table-row").cloneNode(true);
}

function getDayForm() {
    resetDivs();

    if (document.getElementById("day-input").childNodes.length <= 3) {
        var activity_type = document.getElementById("activity-type");

        for(var i = 0; i < activityTypes.length; i++) {
            var textElement = document.createTextNode(activityTypes[i].type_name);
            var newOption = document.createElement("option");

            newOption.setAttribute("value", activityTypes[i].id);
            newOption.appendChild(textElement);

            activity_type.appendChild(newOption);
        }

        var table = document.getElementById("day-input");

        var productiveName = "";
        for (var i = 0; i < 6; i++) {
            var tableRow = document.getElementById("table-row").cloneNode(true);
            var productiveTrue = tableRow.childNodes[5].childNodes[1];
            var productiveFalse = tableRow.childNodes[5].childNodes[5];
            productiveName = "productive" + (i + 1).toString();
            productiveTrue.setAttribute("name", productiveName);
            productiveFalse.setAttribute("name", productiveName);
            table.appendChild(tableRow);
        }
    }

    document.getElementById("table-div").style.visibility="visible";
}

function resetDivs() {
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.visibility="hidden";
    }
}

function getDateInputView() {
    console.log("date input view");

    resetDivs();

    document.getElementById("time-period-selection").style.visibility="visible";
}

function getDateInputEdit() {
    console.log("date input edit");

    resetDivs();
}

function day() {
    var label = createLabelForDateElement();

    var textElement = document.createTextNode("Day to view: ");
    label.appendChild(textElement);

    clearTimeInput();

    appendLabelAndDateToDiv(label, createInputDateElement());
}

function week() {
    var label = createLabelForDateElement();

    var textElement = document.createTextNode("Starting day for desired week: ");
    label.appendChild(textElement);

    clearTimeInput();

    appendLabelAndDateToDiv(label, createInputDateElement());
}

function month() {
    var month = document.createElement("input");
    month.setAttribute("type", "month");
    month.setAttribute("id", "month");

    var label = document.createElement("label");
    label.setAttribute("for", "month");

    var textElement = document.createTextNode("Month to view: ");
    label.appendChild(textElement);

    clearTimeInput();

    appendLabelAndDateToDiv(label, month);
}

function custom() {
    var startDate = createInputDateElement();
    startDate.setAttribute("id", "start-date");

    var endDate = createInputDateElement();
    endDate.setAttribute("id", "end-date");

    var labelStartDate = document.createElement("label");
    labelStartDate.setAttribute("for", "start-date");

    var labelEndDate = document.createElement("label");
    labelEndDate.setAttribute("for", "end-date");

    var textElementForStartDate = document.createTextNode("Starting date to view from: ");
    var textElementForEndDate = document.createTextNode("End date to view to: ");

    labelStartDate.appendChild(textElementForStartDate);
    labelEndDate.appendChild(textElementForEndDate);

    clearTimeInput();

    appendLabelAndDateToDiv(labelStartDate, startDate);
    document.getElementById("time-input").appendChild(document.createElement("br"));
    appendLabelAndDateToDiv(labelEndDate, endDate);
}

function appendLabelAndDateToDiv(label, date) {
    var div = document.getElementById("time-input");
    div.appendChild(label);
    div.appendChild(date);

    div.style.visibility="visible";
}

function createLabelForDateElement() {
    var label = document.createElement("label");
    label.setAttribute("for", "day");

    return label;
}

function createInputDateElement() {
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "date");
    inputElement.setAttribute("id", "day");

    return inputElement;
}

function clearTimeInput(){
    var div = document.getElementById("time-input");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }    
}

function addRow() {
    var table = document.getElementById("day-input");
    table.appendChild(globalTableRow.cloneNode(true));
}

function deleteRow() {
    var table = document.getElementById("day-input");
    if(table.childNodes.length > 3) {
        table.removeChild(table.lastChild);
    }
}

function clearTable() {
    var table = document.getElementById("day-input");

    while(table.childNodes.length > 1) {
        table.removeChild(table.lastChild);
    }

    table.appendChild(globalTableHeaders.cloneNode(true));
    table.appendChild(globalTableRow.cloneNode(true));

    getDayForm();
}