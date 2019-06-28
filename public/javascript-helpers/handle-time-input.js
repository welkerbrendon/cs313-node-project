function handleInput(element) {
    var value = element.value;
    if (isNaN(value)) {
        if (value.includes(":")) {
            var counter = 0;
            var validCharacters = true;
            for (var i = 0; i < value.length; i++) {
                if (isNaN(value[i])) {
                    if (value[i] == ":" && i > 0) {
                        if (counter == 0) {
                            counter++;
                        }
                        else {
                            document.getElementById("Invalid time format. Please enter time with only numbers or in the format of --:--");
                        }
                    }
                    else {
                        document.getElementById("Invalid time format. Please enter time with only numbers or in the format of --:--");
                    }
                }
            }
            if (validCharacters) {
                var onlyNumbers = "";
                for (var i = 0; i < value.length; i++) {
                    if (!isNaN(value[i])) {
                        onlyNumbers += value[i];
                    }
                }
                if (parseInt(onlyNumbers) < 100 || parseInt(onlyNumbers) >= 1300) {
                    document.getElementById("output").innerHTML = "Invalid time given. Please give at least 3 numbers representing the hours (1-12) and minutes (00-59)";
                }
                else {
                    if (onlyNumbers.length == 3) {
                        document.getElementById("output").innerHTML = "";
                        element.value = `0${onlyNumbers[0]}:${onlyNumbers[1]}${onlyNumbers[2]}`;
                    }
                    else {
                        document.getElementById("output").innerHTML = "";
                        element.value = `${onlyNumbers[0]}${value[1]}:${onlyNumbers[2]}${onlyNumbers[3]}`;
                    }
                }
            }
        }
    }
    else {
        if (parseInt(value) < 100 || parseInt(value) >= 1300) {
            document.getElementById("output").innerHTML = "Invalid time given. Please give at least 3 numbers representing the hours (1-12) and minutes (00-59)";
        }
        else {
            if (value.length == 3) {
                document.getElementById("output").innerHTML = "";
                element.value = `0${value[0]}:${value[1]}${value[2]}`;
            }
            else {
                document.getElementById("output").innerHTML = "";
                element.value = `${value[0]}${value[1]}:${value[2]}${value[3]}`;
            }
        }
    }
}