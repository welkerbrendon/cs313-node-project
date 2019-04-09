function getDayToEdit() {
    var day = document.getElementById("date-to-edit").value;
    $.get("/day", {date: day}, displayEditableResult);
}

function displayEditableResult(result, textStatus) {
    document.getElementById("delete-row").setAttribute("onclick", `deleteRow('day-edit', ${result.activities.length})`)
    var div = document.getElementById("parent-edit");
    var table = document.getElementById("day-input").cloneNode(true);
    table.setAttribute("id", "day-edit");

    var tableRow  = table.childNodes[1].childNodes[2];
    var activities = result.activities[0];
    setRow(tableRow, activities);

    for (var i = 1; i < result.activities.length; i++) {
        var newRow = tableRow.cloneNode(true);
        activities = result.activities[i];
        setRow(newRow, activities);
        
        table.appendChild(newRow);
    }

    div.appendChild(table);
    div.style.visibility = "visible";
    addSubmitButton(div);
}

function addSubmitButton(div) {
    var button = document.createElement("button");
    button.setAttribute("onclick", "editDay()");
    button.innerHTML = "Submit";

    div.appendChild(button);
}

function addActivityTypes(column, selectedType) {
    for(var i = 0; i < activityTypes.length; i++) {
        var textElement = document.createTextNode(activityTypes[i].type_name);
        var newOption = document.createElement("option");

        newOption.setAttribute("value", activityTypes[i].id);
        if (activityTypes[i].type_name == selectedType) {
            newOption.setAttribute("selected", "selected");
        }
        newOption.appendChild(textElement);

        column.appendChild(newOption);
    }
}

function setRow(tableRow, activities) {
    tableRow.setAttribute("id", activities.id);
    tableRow.setAttribute("class", "existing-row");
    for (var i = 0; i < tableRow.children.length; i++) {
        var id = tableRow.children[i].getAttribute("id");
        var value = id == "start-time-column" ? activities.start_time :
                    id == "end-time-column" ? activities.end_time :
                    id == "notes-column" ? activities.notes : null;
        
        if (value != null) {
            tableRow.children[i].children[0].value = value;
        }
        else {
            if(id == "activity-type-column") {
                addActivityTypes(tableRow.children[i].children[0], activities.type_name);
            }
            else if (id == "productive-column") {
                tableRow.children[i].children[0].setAttribute("name", 
                                    tableRow.children[i].children[0].getAttribute("name") + i.toString());
                tableRow.children[i].children[2].setAttribute("name", 
                                    tableRow.children[i].children[2].getAttribute("name") + i.toString());
                if (activities.productive) {
                    tableRow.children[i].children[0].checked = true;
                }
                else {
                    tableRow.children[i].children[2].checked = true;
                }
            }
        }
    }
}

function editDay() {
    var rows = document.getElementsByClassName("existing-row");
    var data = {date: document.getElementById("date-to-edit").value, activities: []};
    for (var i = 0; i < rows.length; i++) {
        data.activities.push(getActivity(rows[i]));
    }

    var newRows = document.getElementsByClassName("new-row");
    for (var i = 0; i < newRows.length; i++) {
        data.activities.push(getActivity(newRows[i]));
    }
    console.log(JSON.stringify(data));

    for (var i = 0; i < data.activities.length; i++) {
        var tempActivity = data.activities[i];
        if (tempActivity.start_time == "" || tempActivity.end_time == "" 
                                          || tempActivity.type_id == "") {
            delete data.activities[i];
        }
    }
    console.log(JSON.stringify(data));

    $.post("/edit-day", data, function (result, textStatus) {
        if (result.success = true) {
            console.log("Successfully ran round trip.");
            location.reload();
        }
        else if (textStatus == "500") {
            console.log("Server error.");
            console.log(result);
        } 
        else {
            console.log("Unexpected response from server.");
        }
    });
}

function getActivity(row) {
    var activityId = row.getAttribute("id");
    var activity = {id: activityId};
    for (var i = 0; i < row.children.length; i++) {
        var child = row.children[i];
        switch (child.id) {
            case "start-time-column":
                activity.start_time = child.children[0].value;
                break;
            case "end-time-column":
                activity.end_time = child.children[0].value;
                break;
            case "productive-column":
                activity.productive = child.children[0].checked;
                break;
            case "activity-type-column":
                activity.type_id = child.children[0].value;
                break;
            case "notes-column":
                activity.notes = child.children[0].value;
                break;
        }
    }

    return activity;
}