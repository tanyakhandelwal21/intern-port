$(document).ready(() => {
    let uid = localStorage.getItem("UID")
    var data = {
        "UID": uid
    }

    let username = localStorage.getItem("email").substring(0, localStorage.getItem("email").indexOf("@"));
    $("#greeting_h1").append("Hi " + username + ", here is a joke for you!")
    $.get("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/populate-groups", data, (data, status) => {
        console.log(data)
        $("#company-name").replaceWith("<li id=\"company-name\">" + data.company_name + "</li>")
    
        if (data.group_data != {}) {         
            for (var key in data.group_data) {
                $("<li><a id=\"" + data.group_data[key].name + "\"href=\"javascript:void(0)\" class=\"group\" onclick=\"group_clicked(this.id)\">" + data.group_data[key].name + "</a></li>").insertAfter("#company-name")
            }
        }

        $.getJSON("https://sv443.net/jokeapi/category/Programming?blacklistFlags=nsfw&religious&political", function(data, status){
            if(data.type == "single")
                $("#joke").replaceWith("<div id=\"joke\"><h1>"+data.joke+"</h1></div>")
            else { 
                $("#joke").replaceWith("<div id=\"joke\"><p>"+data.setup+"</p> \
                                    <p>"+data.delivery+"</p></div>")
            }
        });
})


    $("#add-group").click(() => {
        let c_uid = localStorage.getItem("UID");
        var group_name = prompt("Enter a group name");
        if (group_name == null) {
            $("#add-group").attr('href', 'javascript:void(0)')
            return;
        } else {
            $("#add-group").attr('href', '')
        }

        var data_json = {};
        data_json.name = group_name;
        data_json.uid = c_uid;


        $.post("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/add-group", data_json, (data, status) => {
            console.log(data)
        })
    })

    $("#logout").click(() => {
        $.get("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/logout", null, (data, status) => {
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

    $.post("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/make-post", json_to_post, (data, status) => {
        console.log(data)

        if (data.Status == "Success") {
            $.get("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/get-user-details", {"uid": uid, "type": "Company"}, (data_inner, status) => {
                $("#main-card").after("<div class=\"post-card\" id=" +  data.post_id + ">\
                                            <div class=\"container\"></div> \
                                                <h1 class=\"name\">" +  data_inner.username + "</h1> \
                                                <h3 class=\"time\">" +  timestamp + "</h3> \
                                                <h2 class=\"position\">" +  data_inner.position + "</h2> \
                                                <p class=\"post\">" + post_text + "</p> \
                                                <button id=\"like-button\" type=\"button\"> Like </button> \
                                                <p class = \"num-likes\"> 0 Likes </p> \
                                                <br/> \
                                            </div> \
                                        </div>")
            })
        }

    })
}

function add_members() {
    localStorage.setItem("group", document.getElementsByClassName("group-name")[0].innerText)
    localStorage.setItem("company", document.getElementById("company-name").innerText)
    window.location.href = "AddMembers.html"
}

function like_pressed(elem) {
    let id_pressed = elem.parentNode.id

    var current_like_text = $(elem.parentNode.children[6]).text()
    current_like_text = current_like_text.substring(0, current_like_text.indexOf(" "))
    current_like_text = parseInt(current_like_text) + 1

    let data = {
        "post_id": id_pressed,
        "updated_likes": current_like_text,
        "name": document.getElementById("company-name").innerText,
        "group_name": document.getElementsByClassName("group-name")[0].innerText.toLowerCase().replace(" ", "_")
    }

    current_like_text = current_like_text + " Likes"

    $(elem.parentNode.children[6]).text(current_like_text)

    $.post("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/update-likes", data, (data, res) => {
        console.log(data)
    })
}

function group_clicked(id_called) {
    var i, elements = document.getElementsByClassName('post-card');
    for (i = elements.length; i--;) {         
      elements[i].parentNode.removeChild(elements[i]);             
    }
    console.log($("#main-card").length)
    if ($("#main-card").children().length == 0) { 
        $("#joke").remove()
        $("#greeting").remove()
        $("#main-card").css("visibility", "visible")
        $("#main-card").append("<br/> \
                                <h2 class=\"group-name\"></h2> \
                                <a href = \"javascript:void(0)\"> \
                                    <button type=\"button\" id=\"add-members\" onclick=\"add_members()\"><span>&#43;</span>  Add new members</button> \
                                </a> \
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


    $.get("https://cors-anywhere.herokuapp.com/https://intern-port-server.herokuapp.com/get-posts", {"name": document.getElementById("company-name").innerText}, (data, status) => {    
        // var data_returned = JSON.parse(data)
        console.log(data)
        let id = id_called.toLowerCase().replace(" ", "_")
        console.log(data[id])

        if (data[id].posts != null) {
            for (let key in data[id].posts) {
                $("#main-card").after("<div class=\"post-card\" id=" +  key + ">\
                                            <div class=\"container\"></div> \
                                                <h1 class=\"name\">" +  data[id].posts[key].username + "</h1> \
                                                <h3 class=\"time\">" +  data[id].posts[key].timestamp + "</h3> \
                                                <h2 class=\"position\">" +  data[id].posts[key].position + "</h2> \
                                                <p class=\"post\">" + data[id].posts[key].post_text + "</p> \
                                                <button id=\"like-button\" type=\"button\" onclick=\"like_pressed(this)\"> Like </button> \
                                                <p class = \"num-likes\">" + data[id].posts[key].likes + " Likes </p> \
                                                <br/> \
                                            </div> \
                                        </div>")
            }
        }
    })
}