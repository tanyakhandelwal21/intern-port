function sign_in() {
    console.log("Inside function!")
    let password = document.getElementById("pass").value;
    let emailID = document.getElementById("email").value

    var combination = emailID + ":" + password
    combination = btoa(combination)

    let data_json = {
        "user_details": combination,
        "action_type": "Sign In",
        "auth_type": "Company"
    }

    $.post("http://localhost:8100/authentication", data_json, (data, status) => {

        if (data.Status == "Error") {
            alert(data.Message)
        } else if (data.Status == "Success") {
            localStorage.setItem("UID", data.UID)
            window.location.href = "Dashboard.html"
        }
    })
}