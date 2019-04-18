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

function postclicked(id_called) {
    if (document.getElementById("post-box").value == '') {
        return
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                        ];
    let uid = localStorage.getItem("UID")
    let post_text = document.getElementById("post-box").value
    document.getElementById("post-box").value = ""
    let current_time = new Date()
    var timestamp = monthNames[current_time.getMonth()] + " " + current_time.getDate() + " " + current_time.getHours() + ":";
    if (current_time.getMinutes() < 10) {
        console.log("One digit minute")
        timestamp += "0" + current_time.getMinutes()
    } else {
        timestamp += current_time.getMinutes()
    }

    let json_to_post = {
        "post": post_text,
        "uid": uid,
        "timestamp": timestamp,
        "group": document.getElementsByClassName("group-name")[0].innerText.toLowerCase().replace(" ", "_"),
        "company": document.getElementById("company-name").innerText
    }

    console.log(json_to_post)

    $.post("http://localhost:8100/make-post", json_to_post, (data, status) => {
        console.log(data)

        $("#main-card").after("<div class=\"post-card\">\
                                    <div class=\"container\"></div> \
                                        <h1 class=\"name\">Tanya Khandelwal</h1> \
                                        <h3 class=\"time\">" +  timestamp + "</h3> \
                                        <h2 class=\"position\">Software Engineering Intern</h2> \
                                        <p class=\"post\">" + post_text + "</p> \
                                        <br/> \
                                    </div> \
                                </div>")
    })
}

function group_clicked(id_called) {
    var i, elements = document.getElementsByClassName('post-card');
    for (i = elements.length; i--;) {         
      elements[i].parentNode.removeChild(elements[i]);             
    }
    if (!($("#main-card").length)) {
        $("#side-bar").after("<div id=\"main-card\">\
                                <br/> \
                                <h2 class=\"group-name\"></h2> \
                                <hr id=\"line\"> \
                                <h2 id =\"label-for-post\">Let other interns know what's on your mind!</h3> \
                                <input type=\"text\" placeholder=\"Write a post..\" id=\"post-box\">   </input> \
                                <br/> \
                                <input type=\"button\" href=\"\" onclick=\"postclicked(this.id)\" id=\"submit-post\" value=\"POST!\"/> \
                            </div>")
    }
    console.log("Clicked: " + id_called)
    $("a").removeClass(" active")
    document.getElementById(id_called).classList += " active"
    document.getElementsByClassName("group-name")[0].innerText = id_called


    $.get("http://localhost:8100/get-posts", {"name": document.getElementById("company-name").innerText}, (data, status) => {    
        // var data_returned = JSON.parse(data)
        console.log(data)
        let id = id_called.toLowerCase().replace(" ", "_")
        console.log(data[id])

        if (data[id].posts != null) {
            for (let key in data[id].posts) {
                $("#main-card").after("<div class=\"post-card\">\
                                            <div class=\"container\"></div> \
                                                <h1 class=\"name\">Tanya Khandelwal</h1> \
                                                <h3 class=\"time\">" +  data[id].posts[key].timestamp + "</h3> \
                                                <h2 class=\"position\">Software Engineering Intern</h2> \
                                                <p class=\"post\">" + data[id].posts[key].post_text + "</p> \
                                                <br/> \
                                            </div> \
                                        </div>")
            }
        }
    })
}