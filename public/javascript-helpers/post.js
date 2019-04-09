function submitDay() {
    const day = document.getElementById("date").value;

    if(!day) {
        document.getElementById("date-error").innerHTML = "*Please give a date for the following activities.*";
        return;
    }
    else {
        document.getElementById("date-error").innerHTML = "";
        document.getElementById("date").value = null;
    }

    const startTimeElements= document.getElementsByName("start-time");
    var startTimes = new Array(startTimeElements.length); 
    for (var i = 0; i < startTimeElements.length; i++) {
        startTimes[i] = startTimeElements[i].value;
    }

    const endTimeElements = document.getElementsByName("end-time");
    var endTimes = new Array(endTimeElements.length);
    for (var i = 0; i < endTimeElements.length; i++) {
        endTimes[i] = endTimeElements[i].value;
    }

    const productiveElements = document.getElementsByClassName("productive");
    var productive = new Array(productiveElements.length / 2);
    for (var i = 0, j = 0; i < productiveElements.length; i += 2, j++) {
        if(productiveElements[i].checked) {
            productive[j] = productiveElements[i].value;
        }
        else if (productiveElements[i + 1].checked) {
            productive[j] = productiveElements[i + 1].value;
        }
        else {
            productive[j] = null;
        }
    }

    const activityTypeElements = document.getElementsByName("activity-type");
    var activityTypes = new Array(activityTypeElements.length);
    for (var i = 0; i < activityTypeElements.length; i++) {
        activityTypes[i] = activityTypeElements[i].value;
    }

    const noteElements = document.getElementsByName("notes");
    var notes = new Array(noteElements.length);
    for (var i = 0; i < noteElements.length; i++) {
        notes[i] = noteElements[i].value;
    }

    console.log(`Day: ${day}`);
    console.log(`startTimes: ${startTimes}`);
    console.log(`endTimes: ${endTimes}`);
    console.log(`productive: ${productive}`);
    console.log(`activityTypes: ${activityTypes}`);
    console.log(`notes: ${notes}`);

    var jsonPostData = {};
    jsonPostData.date = day;
    jsonPostData.activities = [];
    for(var i = 0; i < startTimes.length; i++) {
        if(startTimes[i] != "" && endTimes[i] != "" && productive[i] != null && activityTypes[i] != "") {
            tempStartTime = startTimes[i];
            tempEndTime = endTimes[i];
            tempProductive = productive[i];
            tempActivityType = activityTypes[i];
            tempNotes = notes[i];

            jsonPostData.activities.push({
                start_time: tempStartTime,
                end_time: tempEndTime,
                productive: tempProductive,
                type_id: tempActivityType,
                notes: tempNotes
            });
        }
        else if (startTimes[i] == "" && endTimes[i] == "" && productive[i] == null && activityTypes[i] == "") {
            console.log(JSON.stringify(jsonPostData));

            $.post("/add-day", jsonPostData, function(response, textStatus) {
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
}