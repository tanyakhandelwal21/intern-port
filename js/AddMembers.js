$(document).ready(() => {
    let name = []
    console.log(JSON.stringify(name))
    localStorage.setItem("members", JSON.stringify(name))
    let group_name = localStorage.getItem("group")
    $("#title").text("Add Members to " + group_name)

    $("#submit").click(() => {
        let company_name = localStorage.getItem("company")
        console.log(localStorage.getItem("members"))
        let data_json = {
            "email": localStorage.getItem("members"),
            "group": group_name,
            "company": company_name
        }

        $.post("https://cors-anywhere.herokuapp.com/https://server.intern-port.com/add-members", data_json, (data, status) => {
            console.log(data)
            window.location.href = "CompanyDashboard.html"
        })
    })

    $("#delete").click(() => {
        let selected = document.getElementById("emails")
        let selected_email = selected.options[selected.selectedIndex].text
        let members = JSON.parse(localStorage.getItem("members"))
        members.splice(members.indexOf(selected_email), 1)
        localStorage.setItem("members", JSON.stringify(members))
        $("#emails option[value='" + selected_email + "']").remove()
    })

    $("#add_member").click(() => {
        let email_id = $("#email").val()
        let members = JSON.parse(localStorage.getItem("members"))
        $("#email").val("")
        if (email_id == "") {
            alert("You have to enter an email ID")
            return
        }
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email_id)) {
            alert("Enter a valid email ID")
            return
        }
        console.log(members)
        console.log(members.indexOf(email_id))

        if (members.indexOf(email_id) == -1) {
            $("select").prepend("<option value=\"" + email_id + "\">" + email_id + "</option>")
            members[members.length] = email_id
            localStorage.setItem("members", JSON.stringify(members))
        }
        console.log(members)
    })
})