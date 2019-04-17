$(document).ready(() => {
    let uid = localStorage.getItem("UID")
    var data = {
        "UID": uid
    }
    $.get("http://localhost:8100/populate-groups", data, (data, status) => {
        console.log(data)
        $("#company-name").replaceWith("<li id=\"company-name\">" + data.company_name + "</li>")

        if (data.group_data != {}) {
            
        }
    })


    $("#add-group").click(() => {
        let c_uid = localStorage.getItem("UID");
        var group_name = prompt("Enter a group name");
        if (group_name == null) {
            return;
        }

        var data_json = {};
        data_json.name = group_name;
        data_json.uid = c_uid;


        $.post("http://localhost:8100/add-group", data_json, (data, status) => {
            console.log(data)
        })
    })
})