function submitPlan(edit, date = null) {
    const day = date == null ? document.getElementById("date").value : date;

    if(!day) {
        document.getElementById("date-error").innerHTML = "*Please give a date for the following activities.*";
        return;
    }
    else {
        document.getElementById("date-error").innerHTML = "";
        document.getElementById("date").value = null;
    }

    const startTimeElements = edit ? document.getElementsByName("start-time-editable") :
                                     document.getElementsByName("start-time");
    const startTimeAMPM = edit ? document.getElementsByName("start-time-am/pm-editable"): 
                                 document.getElementsByName("start-time-am/pm");
    var startTimes = new Array(); 
    for (var i = 0; i < startTimeElements.length; i++) {
        let time = getTime(startTimeElements[i].value, startTimeAMPM[i].value);
        if (time != null) {
            startTimes.push(time);
        }
    }

    const endTimeElements = edit ? document.getElementsByName("end-time-editable") :
                                     document.getElementsByName("end-time");
    const endTimeAMPM = edit ? document.getElementsByName("end-time-am/pm-editable"): 
                                 document.getElementsByName("end-time-am/pm");
    var endTimes = new Array();
    for (var i = 0; i < endTimeElements.length; i++) {
        let time = getTime(endTimeElements[i].value, endTimeAMPM[i].value);
        if (time == null) {
            endTimes.push(time);
        }
    }

    const activityTypeElements = edit ? document.getElementsByName("activity-type-editable") :
                                        document.getElementsByName("activity-type");
    var activityTypes = new Array(activityTypeElements.length);
    for (var i = 0; i < activityTypeElements.length; i++) {
        activityTypes[i] = activityTypeElements[i].value;
    }

    const noteElements = edit ? document.getElementsByName("notes-editable") :
                                document.getElementsByName("notes");
    var notes = new Array(noteElements.length);
    for (var i = 0; i < noteElements.length; i++) {
        notes[i] = noteElements[i].value;
    }

    console.log(`Day: ${day}`);
    console.log(`startTimes: ${startTimes}`);
    console.log(`endTimes: ${endTimes}`);
    console.log(`activityTypes: ${activityTypes}`);
    console.log(`notes: ${notes}`);

    var jsonPostData = {};
    jsonPostData.date = day;
    jsonPostData.activities = [];
    for(var i = 0; i < startTimes.length; i++) {
        if(startTimes[i] != "" && endTimes[i] != "" && activityTypes[i] != "") {
            tempStartTime = startTimes[i];
            tempEndTime = endTimes[i];
            tempActivityType = activityTypes[i];
            tempNotes = notes[i];

            jsonPostData.activities.push({
                start_time: tempStartTime,
                end_time: tempEndTime,
                type_id: tempActivityType,
                notes: tempNotes,
                plan: true
            });
        }
        else if (startTimes[i] == "" && endTimes[i] == "" && activityTypes[i] == "") {
            console.log(JSON.stringify(jsonPostData));

            $.post("/add-plan", jsonPostData, function(response, textStatus) {
                console.log(`Response: ${JSON.stringify(response)}`);
                if(response.success) {
                    resetDivs();
                }
            });

            return;
        }
        else {
            document.getElementById("input-error").innerHTML = "*Please make sure any row with input has a start time, end time, prodctive status, and activity type selected.*";
            return;
        }
    }

    $.post("/add-plan", jsonPostData, function(response, textStatus) {
        console.log(`Response: ${JSON.stringify(response)}`);
        if(response.success) {
            resetDivs();
        }
    });
}

function submitJournal(edit) {
    edit = (edit == "true");
    const day = edit ? document.getElementById("date-to-edit").value : document.getElementById("date").value;
    const journalEntry = edit ? document.getElementById("result-entry").children[2].value: document.getElementById("journal-entry").children[2].value;

    if(!day) {
        document.getElementById("date-error").innerHTML = "*Please give a date for the following activities.*";
        return;
    }
    else {
        document.getElementById("date-error").innerHTML = "";
    }

    var temp = edit ? document.getElementsByName("table-rows") : null;
    var activityIdList = Array();
    if (temp != null) {
        for (var i = 1; i < temp.length; i++) {
            activityIdList.push(temp[i].getAttribute("value"));
        }
    }

    var ignoreList = new Array();

    const startTimeElements = document.getElementsByName("start-time");
    const startTimeAMPM = document.getElementsByName("start-time-am/pm");
    var startTimes = new Array(); 
    for (var i = 0; i < startTimeElements.length; i++) {
        var time = getTime(startTimeElements[i].value, startTimeAMPM[i].value);
        if (time != null) {
            startTimes.push(time);
        }
    }

    const endTimeElements = document.getElementsByName("end-time");
    const endTimeAMPM = document.getElementsByName("end-time-am/pm");
    var endTimes = new Array();
    for (var i = 0; i < endTimeElements.length; i++) {
        var time = getTime(endTimeElements[i].value, endTimeAMPM[i].value);
        if (time != null) {
            endTimes.push(time);
        }
    }

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

    const activityTypeElements = document.getElementsByName("activity-type");
    var activityTypes = new Array();
    for (var i = 0; i < activityTypeElements.length; i++) {
        if (activityTypeElements[i].value != "" && activityTypeElements[i] != null) {
            activityTypes.push(activityTypeElements[i].value);
        }
    }

    const noteElements = document.getElementsByName("notes");
    var notes = new Array();
    for (var i = 0; i < noteElements.length; i++) {
        if (noteElements[i].value != "" && noteElements[i].value != null) {
            notes.push(noteElements[i].value);
        }
    }

    console.log(`Day: ${day}`);
    console.log(`startTimes: ${startTimes}`);
    console.log(`endTimes: ${endTimes}`);
    console.log(`productive: ${productive}`);
    console.log(`activityTypes: ${activityTypes}`);
    console.log(`notes: ${notes}`);

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
                        clearTable("day-input");
                        resetDivs();
                    }
                });
            }
            else {
                $.post("/edit-day", jsonPostData, function(response, textStatus) {
                    console.log(`Response: ${JSON.stringify(response)}`);
                    if(response.success) {
                        document.getElementById("date").value = null;
                        clearTable("results-table");
                        resetDivs();
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
                clearTable("day-input");
                clearTextAreas();
                resetDivs();
            }
        });
    }
    else {
        $.post("/edit-day", jsonPostData, function(response, textStatus) {
            console.log(`Response: ${JSON.stringify(response)}`);
            if(response.success) {
                document.getElementById("date").value = null;
                clearTable("results-table");
                clearTextAreas();
                resetDivs();
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