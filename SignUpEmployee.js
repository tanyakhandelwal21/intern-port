function create_account() {
    console.log("Inside function!")
    let password = document.getElementById("pass").value;
    let confirmed_password = document.getElementById("cpass").value

    if (password != confirmed_password) {
        alert("Passwords don't match. Try again.")
        return
    }

    let emailID = document.getElementById("email").value
    let position = document.getElementById("posn").value

    var combination = emailID + ":" + password
    combination = btoa(combination)

    let data_json = {
        "user_details": combination,
        "action_type": "Create",
        "auth_type": "Employee",
        "position": position
    }

    console.log(data_json)

    $.post("http://localhost:8100/authentication", data_json, (data, status) => {

        if (data.Status == "Error") {
            alert(data.Message)
        } else if (data.Status == "Success") {
            window.location.href = "EmployeeLoginPage.html"
        }
    })
}