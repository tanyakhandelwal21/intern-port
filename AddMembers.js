$(document).ready(() => {
    let group_name = localStorage.getItem("group")
    $("#title").text("Add Members to " + group_name)

    $("#submit").click(() => {
        let company_name = localStorage.getItem("company")
        let email_id = $("#email").val()
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email_id)) {
            alert("Enter a valid email ID")
            return
        }
        if (email_id == "") {
            alert("You have to enter an email ID")
            return
        }

        let data_json = {
            "email": email_id,
            "group": group_name,
            "company": company_name
        }

        $.post("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/add-members", data_json, (data, status) => {
            console.log(data)
            window.location.href = "CompanyDashboard.html"
        })
    })
})