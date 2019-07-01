function signOut() {
    console.log("Sign out");
    $.post("/sign-out", function (result, textStatus) {
        if (textStatus == "success") {
            window.location.href = result.redirect;
        }
        else {
            console.log("Unable to log user out.");
        }
    });
}