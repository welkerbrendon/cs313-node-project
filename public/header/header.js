function signOut() {
    console.log("Sign out");
    $.post("/sign-out", function (err, result) {
        if (err) {
            console.log("Unable to log user out.");
        }
        else {
            window.location.href = result.redirect;
        }
    });
}