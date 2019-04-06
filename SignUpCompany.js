function create_account() {
    console.log("Inside function!")
    let password = document.getElementById("pass").value;
    let confirmed_password = document.getElementById("cpass").value
    let company_name = document.getElementById("cname").value.toLowerCase()

    if (password != confirmed_password) {
        alert("Passwords don't match. Try again.")
        return
    }

    let emailID = document.getElementById("email").value

    var combination = emailID + ":" + password
    combination = btoa(combination)

    let data_json = {
        "user_details": combination,
        "action_type": "Create",
        "auth_type": "Company",
        "company_name": company_name
    }

    $.post("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/authentication", data_json, (data, status) => {

        if (data.Status == "Error") {
            alert(data.Message)
        }
    })
}