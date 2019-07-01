function submitPlan(edit) {
    const day = getDayForPosting(edit);

    if (day == null) {
        return;
    }

    const activityIdList = edit ? getActivityIdList() : null;
    const startTimes = getStartTimes();
    const endTimes = getEndTimes();
    const activityTypes = getActivityTypeValues();
    const notes = getNotes();

    console.log(`Day: ${day}`);
    console.log(`startTimes: ${startTimes}`);
    console.log(`endTimes: ${endTimes}`);
    console.log(`activityTypes: ${activityTypes}`);
    console.log(`notes: ${notes}`);
    if (edit) {
        console.log(`activityIdList: ${activityIdList}`);
    }

    var jsonPostData = {};
    jsonPostData.date = day;
    jsonPostData.activities = [];
    for(var i = 0; i < startTimes.length; i++) {
        if(startTimes[i] != "" && endTimes[i] != "" && activityTypes[i] != "") {
            tempStartTime = startTimes[i];
            tempEndTime = endTimes[i];
            tempActivityType = activityTypes[i];
            tempNotes = notes[i];
            tempActivityId = edit ? activityIdList[i] : null;

            jsonPostData.activities.push({
                id: tempActivityId,
                start_time: tempStartTime,
                end_time: tempEndTime,
                type_id: tempActivityType,
                notes: tempNotes,
                productive: null,
                plan: true
            });
        }
        else if (startTimes[i] == "" && endTimes[i] == "" && activityTypes[i] == "") {
            console.log(JSON.stringify(jsonPostData));

            if (!edit) {
                $.post("/add-plan", jsonPostData, function(response, textStatus) {
                    console.log(`Response: ${JSON.stringify(response)}`);
                    if(response.success) {
                        document.getElementById("date").value = null;
                        clearTable("day-input", true);
                        resetDivs();
                        scroll(0,0);
                    }
                });
            }
            else {
                $.post("/edit-day", jsonPostData, function (response, textStatus) {
                    console.log(`Response: ${JSON.stringify(response)}`);
                    if (response.success) {
                        document.getElementById("date").value = null;
                        clearTable("results-table", true);
                        resetDivs();
                        scroll(0,0);
                    }
                });
            }

            return;
        }
        else {
            document.getElementById("input-error").innerHTML = "*Please make sure any row with input has a start time, end time, prodctive status, and activity type selected.*";
            return;
        }
    }
    if (!edit) {
        $.post("/add-plan", jsonPostData, function(response, textStatus) {
            console.log(`Response: ${JSON.stringify(response)}`);
            if(response.success) {
                document.getElementById("date").value = null;
                clearTable("day-input", true);
                resetDivs();
                scroll(0,0);
            }
        });
    }
    else {
        $.post("/edit-day", jsonPostData, function (response, textStatus) {
            console.log(`Response: ${JSON.stringify(response)}`);
            if (response.success) {
                document.getElementById("date").value = null;
                clearTable("results-table", true);
                resetDivs();
                scroll(0,0);
            }
        });
    }
}

function getDayForPosting(edit) {
    const day = edit ? document.getElementById("date-to-edit").value : document.getElementById("date").value;

    if(!day) {
        document.getElementById("date-error").innerHTML = "*Please give a date for the following activities.*";
        return null;
    }
    else {
        document.getElementById("date-error").innerHTML = "";
        return day;
    }
}

function getActivityIdList() {
    var temp = document.getElementsByName("table-rows");
    var activityIdList = Array();
    if (temp != null) {
        for (var i = 0; i < temp.length; i++) {
            activityIdList.push(temp[i].getAttribute("value"));
        }
    }

    return activityIdList;
}

function getStartTimes() {
    const startTimeElements = document.getElementsByName("start-time");
    const startTimeAMPM = document.getElementsByName("start-time-am/pm");
    var startTimes = new Array(); 
    for (var i = 0; i < startTimeElements.length; i++) {
        var time = getTime(startTimeElements[i].value, startTimeAMPM[i].value);
        if (time != null) {
            startTimes.push(time);
        }
    }

    return startTimes;
}

function getEndTimes() {
    const endTimeElements = document.getElementsByName("end-time");
    const endTimeAMPM = document.getElementsByName("end-time-am/pm");
    var endTimes = new Array();
    for (var i = 0; i < endTimeElements.length; i++) {
        var time = getTime(endTimeElements[i].value, endTimeAMPM[i].value);
        if (time != null) {
            endTimes.push(time);
        }
    }

    return endTimes;
}

function getProductiveValues() {
    const productiveElements = document.getElementsByClassName("productive");
    var productive = new Array();
    for (var i = 0, j = 0; i < productiveElements.length; i += 2, j++) {
        if(productiveElements[i].checked) {
            productive.push(productiveElements[i].value);
        }
        else if (productiveElements[i + 1].checked) {
            productive.push(productiveElements[i + 1].value);
        }
    }

    return productive;
}

function getActivityTypeValues() {
    const activityTypeElements = document.getElementsByName("activity-type");
    var activityTypes = new Array();
    for (var i = 0; i < activityTypeElements.length; i++) {
        if (activityTypeElements[i].value != "" && activityTypeElements[i] != null) {
            activityTypes.push(activityTypeElements[i].value);
        }
    }
    return activityTypes;
}

function getNotes() {
    const noteElements = document.getElementsByName("notes");
    var notes = new Array();
    for (var i = 0; i < noteElements.length; i++) {
        if (noteElements[i].value != "" && noteElements[i].value != null) {
            notes.push(noteElements[i].value);
        }
    }
    return notes;
}

function submitJournal(edit) {
    const day = getDayForPosting(edit);

    if (day == null) {
        return;
    }

    const journalEntry = edit ? document.getElementById("result-entry").children[2].value: document.getElementById("journal-entry").children[2].value;
    const activityIdList = edit ? getActivityIdList() : null;
    const startTimes = getStartTimes();
    const endTimes = getEndTimes();
    const productive = getProductiveValues();
    const activityTypes = getActivityTypeValues();
    const notes = getNotes();

    console.log(`Day: ${day}`);
    console.log(`startTimes: ${startTimes}`);
    console.log(`endTimes: ${endTimes}`);
    console.log(`productive: ${productive}`);
    console.log(`activityTypes: ${activityTypes}`);
    console.log(`notes: ${notes}`);
    if (edit) {
        console.log(`activityIdList: ${activityIdList}`);
    }

    var jsonPostData = {};
    jsonPostData.date = day;
    jsonPostData.entry = journalEntry;
    jsonPostData.activities = [];
    for(var i = 0; i < startTimes.length; i++) {
        if(startTimes[i] != "" && endTimes[i] != "" && productive[i] != null && activityTypes[i] != "") {
            tempStartTime = startTimes[i];
            tempEndTime = endTimes[i];
            tempProductive = productive[i];
            tempActivityType = activityTypes[i];
            tempNotes = notes.length > i ? notes[i] : null;
            tempActivityId = edit ? activityIdList[i] : null;

            jsonPostData.activities.push({
                start_time: tempStartTime,
                end_time: tempEndTime,
                productive: tempProductive,
                type_id: tempActivityType,
                notes: tempNotes,
                id: tempActivityId,
                plan: false
            });
        }
        else if (startTimes[i] == "" && endTimes[i] == "" && productive[i] == null && activityTypes[i] == "") {
            console.log(JSON.stringify(jsonPostData));

            if (!edit) {
                $.post("/add-journal-entry", jsonPostData, function(response, textStatus) {
                    console.log(`Response: ${JSON.stringify(response)}`);
                    if(response.success) {
                        document.getElementById("date").value = null;
                        clearTable("day-input", false);
                        resetDivs();
                        scroll(0,0);
                    }
                });
            }
            else {
                $.post("/edit-day", jsonPostData, function(response, textStatus) {
                    console.log(`Response: ${JSON.stringify(response)}`);
                    if(response.success) {
                        document.getElementById("date").value = null;
                        clearTable("results-table", false);
                        resetDivs();
                        scroll(0,0);
                    }
                });
            }
            return;
        }
        else {
            document.getElementById("input-error").innerHTML = "*Please make sure any row with input has a start time, end time, prodctive status, and activity type selected.*";
            return;
        }
    }

    if (!edit) {
        $.post("/add-journal-entry", jsonPostData, function(response, textStatus) {
            console.log(`Response: ${JSON.stringify(response)}`);
            if(response.success) {
                document.getElementById("date").value = null;
                clearTable("day-input", false);
                clearTextAreas();
                resetDivs();
                scroll(0,0);
            }
        });
    }
    else {
        $.post("/edit-day", jsonPostData, function(response, textStatus) {
            console.log(`Response: ${JSON.stringify(response)}`);
            if(response.success) {
                document.getElementById("date").value = null;
                clearTable("results-table", false);
                clearTextAreas();
                resetDivs();
                scroll(0,0);
            }
        });
    }  
}

function clearTextAreas() {
    var textareaList = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareaList.length; i++) {
        textareaList[i].value = "";
    }
}