let uid = localStorage.getItem("UID")
var data = {
    "UID": uid
}
$.get("http://localhost:8100/populate-groups", data, (data, status) => {
    console.log(data)
})

function addGroup() {
    let uid = localStorage.getItem("UID")
    var group_name = prompt("Enter a group name")
    if (group_name.length == 0) {
        return
    }
    var company_name = $("#company-name").text()

    let data_post = {
        "company-name": company_name,
        "group-name": group_name,
        "uid": uid
    }

    $.post("http://localhost:8100/add-group", data_post, (data, status) => {
        if (data.Status == "Error") {
            alert(data.Message)
        }
    })
}