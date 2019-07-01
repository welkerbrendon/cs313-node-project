function handleInput(element) {
    if (element.value.length > 2) {
        if (isNaN(element.value)) {
            handlePreFormatted(element);
        }
        else {
            handleNumOnly(element);
        }
    }
    else {
        document.getElementById("error").innerHTML = "ERROR: invalid time. Too few numbers given.";
    }
}

function handleCharacter(element) {
    var cleanValue = "";
    var count = 0;
    for (var i = 0; i < element.value.length; i++) {
        cleanValue += ((!isNaN(element.value[i]) && element.value[i] != " ")
                      || (element.value[i] == ":" && count < 1)) ? element.value[i] : "";
        if (element.value[i] == ":") {
            count++;
        }
    }
    element.value = cleanValue;
}

function handlePreFormatted(element) {
    var hours = parseInt(element.value.split(":")[0]);
    var minutes = parseInt(element.value.split(":")[1]);

    if (hours > 12 || minutes > 59 || hours < 1 || minutes < 0) {
        document.getElementById("error").innerHTML = "ERROR: Invalid time. Please follow format of (1-12):(00-59)";
    }
}

function handleNumOnly(element) {
    const valueAsInt = parseInt(element.value);
    if (valueAsInt < 100 || valueAsInt > 1300 || (valueAsInt % 100 > 59) || (parseInt(valueAsInt / 100) > 12)) {
        document.getElementById("error").innerHTML = "ERROR: Invalid time. Please input at least 3 numbers representing the hours (1-12) and minutes (00-59).";
    }
    else {
        if (element.value.length == 3) {
            element.value = `0${element.value[0]}:${element.value[1]}${element.value[2]}`;
            document.getElementById("error").innerHTML = "";
        }
        else {
            element.value = `${element.value[0]}${element.value[1]}:${element.value[2]}${element.value[3]}`;
            document.getElementById("error").innerHTML = "";
        }
    }
}

function getTimes() {
    var times = document.getElementsByName("time");
    var amPMs = document.getElementsByName("am/pm");
    if (times.length == amPMs.length) {
        var output = "";
        for (var i = 0; i < times.length; i++) {
            output += getFullTime(times[i].value, amPMs[i].value) + "<br>";
        }
        document.getElementById("error").innerHTML = output;
    }
}

function getTime(time, amPM) {
    if (time.length < 3) {
        return null;
    }
    else {
        var hours = "";
        for (var i = 0; i < time.length && time[i] != ":"; i++) {
            hours += time[i];
        }
        var minutes = "";
        for (var i = (time.indexOf(":") + 1); i < time.length; i++) {
            minutes += time[i];
        }
        var hoursAsInt = parseInt(hours);
        if (amPM == "PM") {
            if (hoursAsInt < 12) {
                return `${hoursAsInt + 12}:${minutes}`;
            }
            else {
                return time;
            }
        }
        else {
            if (hoursAsInt == 12) {
                return `00:${minutes}`;
            }
            else {
                return time;
            }
        }
    }

}