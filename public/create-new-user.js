function createUser(){
    const jsonPost = {
        first: document.getElementById("first").value,
        last: document.getElementById("last").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    };
    $.post("/create-user", jsonPost, function(response, textStatus){
        console.log(`Response: ${JSON.stringify(response)}`);
        if (response.redirect) {
            window.location.href = response.redirect;
        }
        else {
            document.getElementById("error").innerHTML = response.message;
        }
    });
}