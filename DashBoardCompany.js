$(document).ready(() => {
    let uid = localStorage.getItem("UID")
    var data = {
        "UID": uid
    }
    $.get("http://localhost:8100/populate-groups", data, (data, status) => {
        console.log(data)
        $("#company-name").replaceWith("<li id=\"company-name\">" + data.company_name + "</li>")

        if (data.group_data != {}) {   
            for (var key in data.group_data) {
                $("<li><a id=\"" + data.group_data[key].name + "\"href=\"javascript:void(0)\" class=\"group\" onclick=\"group_clicked(this.id)\">" + data.group_data[key].name + "</a></li>").insertAfter("#company-name")
            }
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

    $("#logout").click(() => {
        $.get("http://localhost:8100/logout", null, (data, status) => {
            if (data.Status == "Error") {
                alert(data.Message)
            } else if (data.Status == "Success") {
                console.log("logged out")
                window.location.href = "index.html"
            }
        })
    })
})

function group_clicked(id_called) {
    console.log("Clicked: " + event.srcElement.id)
    $("a").removeClass(" active")
    document.getElementById(event.srcElement.id).classList += " active"
    document.getElementsByClassName("group-name")[0].innerText = event.srcElement.id

    $.get("http://localhost:8100/get-posts", {"name": document.getElementById("company-name").innerText}, (data, status) => {    
        // var data_returned = JSON.parse(data)
        console.log(data)
        let id = id_called.toLowerCase().replace(" ", "_")
        console.log("id: " + id)
        console.log(data[id])
    })
}