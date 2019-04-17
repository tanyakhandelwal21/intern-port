let UID = localStorage.getItem("UID")
console.log("UID: " + UID);

let data_to_send = {
    "UID": UID
}

$.get("http://localhost:8100/populate-groups", data_to_send).done(function (response) {
    if (response.Status == "Error") {
        alert(response.Message)
        window.location.href = "index.html"
    }
})