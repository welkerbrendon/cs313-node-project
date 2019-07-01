window.onload = setUp;

var activityTypes = null;
var globalTableHeaders = null;
var globalTableRow = null;
var globalTable = null

function setUp() {
    getLoggedInStatus();
    getActivityTypes();

    globalTableRow = document.getElementById("table-row").cloneNode(true);
    globalTableHeaders = document.getElementById("table-headers").cloneNode(true);
    globalTable = document.getElementById("day-input").cloneNode(true);
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
function getDayForm(plan) {
    resetDivs();

    if (document.getElementById("day-input").childNodes.length <= 3) {
        addActivityTypes(document.getElementById("activity-type"));

        var table = document.getElementById("day-input");

        var productiveName = "";
        for (var i = 0; i < 6; i++) {
            var tableRow = document.getElementById("table-row").cloneNode(true);
            if (!plan) {
                var productiveTrue = tableRow.childNodes[5].childNodes[1];
                var productiveFalse = tableRow.childNodes[5].childNodes[5];
                productiveName = "productive" + (i + 1).toString();
                productiveTrue.setAttribute("name", productiveName);
                productiveFalse.setAttribute("name", productiveName);
            }
            table.appendChild(tableRow);
        }
    }

    document.getElementById("table-div").style.visibility="visible";
    if (document.getElementById("journal-entry")) {
        document.getElementById("journal-entry").style.visibility="visible";
    }
}

function resetDivs() {
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        var classValue = divs[i].getAttribute("class");
        if (classValue != "body" && classValue != "navbar") {
            divs[i].style.visibility="hidden";
        }
    }
}

function getDateInputView() {
    console.log("date input view");

    resetDivs();

    document.getElementById("time-input").style.visibility="visible";
}

function getDateInputEdit() {
    console.log("date input edit");

    clearTable("day-input");
    resetDivs();

    document.getElementById("edit").style.visibility = "visible";
}

function day(id) {
    var label = createLabelForDateElement();

    var textElement = document.createTextNode("Day to view: ");
    label.appendChild(textElement);

    clearTimeInput();

    appendLabelAndDateToDiv(label, createInputDateElement(), id);
}

function week() {
    var label = createLabelForDateElement();

    var textElement = document.createTextNode("Starting day for desired week: ");
    label.appendChild(textElement);

    clearTimeInput();

    appendLabelAndDateToDiv(label, createInputDateElement(), "time-input");
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

    appendLabelAndDateToDiv(label, month, "time-input");
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

    appendLabelAndDateToDiv(labelStartDate, startDate, "time-input");
    document.getElementById("time-input").appendChild(document.createElement("br"));
    appendLabelAndDateToDiv(labelEndDate, endDate, "time-input");
}

function appendLabelAndDateToDiv(label, date, id) {
    var div = document.getElementById(id);
    if (id != "time-input") {
        div.appendChild(document.createElement("br"));
    }
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

function addRow(id) {
    var table = document.getElementById(id);

    var newRow = globalTableRow.cloneNode(true);
    newRow.setAttribute("class", "new-row");

    productiveTrue = newRow.children[2].children[0];
    productiveFalse = newRow.children[2].children[2];
    var newName = Math.random().toString();
    productiveTrue.setAttribute("name", newName);
    productiveFalse.setAttribute("name", newName);

    for (var i = 0; i < newRow.children.length; i++) {
        try {
            var id = newRow.children[i].getAttribute("id");
            if (id == "activity-type-column") {
                addActivityTypes(newRow.children[i].children[0]);
            }
        } catch (error) {
            
        }
    }

    table.appendChild(newRow);
}

function deleteRow(id, minRows) {
    var table = document.getElementById(id);
    if (table.childNodes.length > 1 + minRows) {
        table.removeChild(table.lastChild);
    }
    else if (table.childNodes.length > 3) {

    }
}

function clearTable(id) {
    var table = document.getElementById(id);

    while(table.childNodes.length > 1) {
        table.removeChild(table.lastChild);
    }

    table.appendChild(globalTableHeaders.cloneNode(true));
    table.appendChild(globalTableRow.cloneNode(true));

    getDayForm();
}

function addActivityTypes(activityTypeElement) {
    for(var i = 0; i < activityTypes.length; i++) {
        var textElement = document.createTextNode(activityTypes[i].type_name);
        var newOption = document.createElement("option");

        newOption.setAttribute("value", activityTypes[i].id);
        newOption.appendChild(textElement);

        activity_type.appendChild(newOption);
    }
}