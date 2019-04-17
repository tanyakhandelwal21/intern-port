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

    $("#submit-post").click(() => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                            ];
        let uid = localStorage.getItem("UID")
        let post_text = document.getElementById("post-box").value
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
        })
    })
})

function group_clicked(id_called) {
    if (!($("#main-card").length)) {
        $("#side-bar").after("<div id=\"main-card\">\
                                <br/> \
                                <h2 class=\"group-name\"></h2> \
                                <hr id=\"line\"> \
                                <h2 id =\"label-for-post\">Let other interns know what's on your mind!</h3> \
                                <input type=\"text\" placeholder=\"Write a post..\" id=\"post-box\">   </input> \
                                <br/> \
                                <input type=\"button\" id=\"submit-post\" value=\"POST!\"/> \
                            </div>")
    }
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

        if (data[id].posts != null) {
            for (let key in data[id].posts) {
                $("#main-card").after(" <div class=\"post-card\">\
                                        <div class=\"container\"></div> \
                                            <h1 class=\"name\"> Tanya Khandelwal</h1> \
                                            <h3 class=\"time\">May 18 5:09 PM</h3> \
                                            <h2 class=\"position\">Software Engineering Intern</h2> \
                                            <p class=\"post\">Who's hyped for the internship??</p> \
                                            <br/> \
                                        </div> \
                                    </div>")
            }
        }
    })
}