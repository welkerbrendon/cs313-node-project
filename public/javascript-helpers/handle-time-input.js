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
        document.getElementById("output").innerHTML = "ERROR: invalid time. Too few numbers given.";
    }
}

function handlePreFormatted(element) {
    if (isNaN(element.value[0])) {
        document.getElementById("output").innerHTML = "ERROR: Invalid time. Please enter only the numbers or follow the pattern --:--.";
    }
    else if (isNaN(element.value[1]) && element.value[1] != ":") {
        document.getElementById("output").innerHTML = "ERROR: Invalid time. Please enter only the numbers or follow the pattern --:--.";
    }
    else if (isNaN(element.value[2]) && element.value[2] != ":") {
        document.getElementById("output").innerHTML = "ERROR: Invalid time. Please enter only the numbers or follow the pattern --:--.";
    }
    else {
        for (var i = 3; i < element.value.length; i++) {
            if (isNaN(element.value[i])) {
                document.getElementById("output").innerHTML = "ERROR: Invalid time. Please enter only the numbers or follow the pattern --:--.";
                return;
            }
        }
        document.getElementById("output").innerHTML = "";
    }
}

function handleNumOnly(element) {
    const valueAsInt = parseInt(element.value);
    if (valueAsInt < 100 || valueAsInt > 1300 || (valueAsInt % 100 > 59) || (valueAsInt / 100 > 12)) {
        document.getElementById("output").innerHTML = "ERROR: Invalid time. Please input at least 3 numbers representing the hours (1-12) and minutes (00-59).";
    }
    else {
        if (element.value.length == 3) {
            element.value = `0${element.value[0]}:${element.value[1]}${element.value[2]}`;
            document.getElementById("output").innerHTML = "";
        }
        else {
            element.value = `${element.value[0]}${element.value[1]}:${element.value[2]}${element.value[3]}`;
            document.getElementById("output").innerHTML = "";
        }
    }
}