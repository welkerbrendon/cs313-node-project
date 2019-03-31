function logIn(){
    const jsonPost = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    $.post("/log-in", jsonPost, function(result, textStatus) {
        console.log(`Result from post: ${JSON.stringify(result)}`);
        if (result.redirect){
            window.location.href = result.redirect;
        }
        else {
            document.getElementById("error").innerHTML = result.message;
        }
    });
}