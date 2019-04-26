$(document).ready(() => {
    let uid = localStorage.getItem("UID")
    var data = {
        "UID": uid
    }

    let username = localStorage.getItem("email").substring(0, localStorage.getItem("email").indexOf("@"));
    $("#logout").append("<a href=\"javascript:void(0)\">Logout " + username + "</a>")
    $("#greeting_h1").append("Hi " + username + ", here is a joke for you!")
    $.get("https://server.intern-port.com/populate-groups", data, (data, status) => {
        console.log(data)
        $("#company-name").replaceWith("<li id=\"company-name\">" + data.company_name + "</li>")

        if (data.group_data != {}) {   
            for (var key in data.group_data) {
                $("<li><a id=\"" + data.group_data[key].name + "\"href=\"javascript:void(0)\" class=\"group\" onclick=\"group_clicked(this.id)\">" + data.group_data[key].name + "</a></li>").insertAfter("#company-name")
            }
        }
        $.get("https://official-joke-api.appspot.com/random_joke", (data, status) => {
            $("#joke").replaceWith("<div id=\"joke\"><p>"+data.setup+"</p> \
                                    <p>"+data.punchline+" 😂</p></div>")
        }).always(() => {
            $("#loader").remove()
        });;
    })

    $("#logout").click(() => {
        $.get("https://server.intern-port.com/logout", null, (data, status) => {
            if (data.Status == "Error") {
                alert(data.Message)
            } else if (data.Status == "Success") {
                console.log("logged out")
                window.location.href = "../index.html"
            }
        })
    })

    $("#main-card").on("keypress", "#post-box", (e) => {
        if (e.keyCode == 13) {
            console.log("POST")
            $("#submit-post").click()
        }
    })
})

function like_pressed(elem) {
    let id_pressed = elem.parentNode.id
    let button_text = $(elem.parentNode.children[5]).text()

    if (button_text == "Like") {
        $(elem.parentNode.children[5]).text("Unlike")
    } else {
        $(elem.parentNode.children[5]).text("Like")
    }

    var current_like_text = $(elem.parentNode.children[6]).text()
    current_like_text = current_like_text.substring(0, current_like_text.indexOf(" "))

    if (button_text == "Like") {
        current_like_text = parseInt(current_like_text) + 1
    } else {
        current_like_text = parseInt(current_like_text) - 1
    }

    let data = {
        "post_id": id_pressed,
        "op_type": button_text,
        "updated_likes": current_like_text,
        "name": document.getElementById("company-name").innerText,
        "group_name": document.getElementsByClassName("group-name")[0].innerText.toLowerCase().replace(" ", "_")
    }

    if(current_like_text == 1)
        current_like_text = current_like_text + " Like"
    else
        current_like_text = current_like_text + " Likes"

    $(elem.parentNode.children[6]).text(current_like_text)

    $.post("https://server.intern-port.com/update-likes", data, (data, res) => {
        console.log(data)
    })
}

function delete_pressed(elem) {
    console.log("Delete Pressed 1")
    let id_pressed = elem.parentNode.id

    let data = {
        "post_id": id_pressed,
        "name": document.getElementById("company-name").innerText,
        "group_name": document.getElementsByClassName("group-name")[0].innerText.toLowerCase().replace(" ", "_")
    }

    console.log(data)

    console.log("Delete Pressed 2")
    $.post("https://server.intern-port.com/delete-post", data, (data, res) => {
        console.log(data)

        $(elem.parentNode).remove()
    })
}

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

    $.post("https://server.intern-port.com/make-post", json_to_post, (data_outer, status) => {
        console.log(data_outer)
        // console.log(username + ' '+data.posts[key].username)
        if(data_outer.Status == "Success") { 
        $.get("https://server.intern-port.com/get-user-details", {"uid": uid, "type": "Employee"}, (data, status) => {
            $("#main-card").after("<div class=\"post-card\" id=" +  data_outer.post_id + ">\
                                                <div class=\"container\"></div> \
                                                    <h1 class=\"name\">" + data.username + "</h1> \
                                                    <h3 class=\"time\">" +  timestamp + "</h3> \
                                                    <h2 class=\"position\">" + data.position + "</h2> \
                                                    <p class=\"post\">" + post_text + "</p> \
                                                    <button type=\"button\" class=\"delete-button\" onclick=\"delete_pressed(this)\">Delete</button> \
                                                    <button type=\"button\" class=\"like-button\" onclick=\"like_pressed(this)\">Like</button> \
                                                    <p class = \"num-likes\">0 Likes</p> \
                                                    <br/> \
                                                </div> \
                                            </div>")
        })
    }
    })
}

function group_clicked(id_called) {
    var i, elements = document.getElementsByClassName('post-card');
    for (i = elements.length; i--;) {         
      elements[i].parentNode.removeChild(elements[i]);             
    }
    if ($("#main-card").children().length == 0) { 
        $("#joke").remove()
        $("#greeting").remove()
        $("#main-card").css("visibility", "visible")
        $("#main-card").append("<br/> \
                                <h2 class=\"group-name\"></h2> \
                                <hr id=\"line\"> \
                                <h2 id =\"label-for-post\">Let other interns know what's on your mind!</h2> \
                                <input type=\"text\" placeholder=\"Write a post..\" id=\"post-box\">   </input> \
                                <br/> \
                                <input type=\"button\" href=\"\" onclick=\"postclicked(this.id)\" id=\"submit-post\" value=\"POST!\"/> ")
    }
    console.log("Clicked: " + id_called)
    $("a").removeClass(" active")
    document.getElementById(id_called).classList += " active"
    document.getElementsByClassName("group-name")[0].innerText = id_called


    $.get("https://server.intern-port.com/get-posts", {"name": document.getElementById("company-name").innerText, "group_name": id_called.toLowerCase().replace(" ", "_")}, (data, status) => {    
        // var data_returned = JSON.parse(data)
        console.log(data)

        let username = localStorage.getItem("email").substring(0, localStorage.getItem("email").indexOf("@"));

        if (data.posts != null) {
            for (let key in data.posts) {
                console.log(username + ' '+data.posts[key].username)
                if(username == data.posts[key].username) {
                    $("#main-card").after("<div class=\"post-card\" id=" +  key + ">\
                                                <div class=\"container\"></div> \
                                                    <h1 class=\"name\">" + data.posts[key].username + "</h1> \
                                                    <h3 class=\"time\">" +  data.posts[key].timestamp + "</h3> \
                                                    <h2 class=\"position\">" + data.posts[key].position + "</h2> \
                                                    <p class=\"post\">" + data.posts[key].post_text + "</p> \
                                                    <button type=\"button\" class=\"delete-button\" onclick=\"delete_pressed(this)\">Delete</button> \
                                                    <button type=\"button\" class=\"like-button\" onclick=\"like_pressed(this)\">Like</button> \
                                                    <p class = \"num-likes\">" + data.posts[key].likes + " Likes </p> \
                                                    <br/> \
                                                </div> \
                                            </div>")
                    }
                else {
                        $("#main-card").after("<div class=\"post-card\" id=" +  key + ">\
                        <div class=\"container\"></div> \
                            <h1 class=\"name\">" + data.posts[key].username + "</h1> \
                            <h3 class=\"time\">" +  data.posts[key].timestamp + "</h3> \
                            <h2 class=\"position\">" + data.posts[key].position + "</h2> \
                            <p class=\"post\">" + data.posts[key].post_text + "</p> \
                            <button type=\"button\" class=\"like-button-first\" onclick=\"like_pressed(this)\">Like</button> \
                            <p class = \"num-likes\">" + data.posts[key].likes + " Likes </p> \
                            <br/> \
                        </div> \
                    </div>")
                }
            }
        }
    })
}