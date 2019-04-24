const express = require('express')
const bodyParser = require('body-parser')
const firebase_import = require('firebase/app')
const app = express().use(bodyParser.json())
var cors = require('cors');
const firebase = firebase_import.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: "intern-port.firebaseapp.com",
    databaseURL: "https://intern-port.firebaseio.com",
    projectId: "intern-port",
    storageBucket: "",
    messagingSenderId: "780912934069"
})

require('firebase/auth')
require('firebase/database')
const root_db = firebase.database().ref()

app.listen(process.env.PORT || 8100, () => console.log("Server is listening"))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/get-posts", (req, res) => {
    root_db.child("Companies").orderByValue().once("value", (snapshot) => {
        let data = snapshot.val()
        // console.log(data)
        for (var key in data) {
            if (data[key].name == req.query.name) {
                res.send(data[key].groups)
            }
        }
        // res.send(data)
    })
})

app.get("/test", (req, res) => {
	res.send("Received connection")
})

app.post("/add-members", (req, res) => {
    root_db.child("Companies").orderByKey().once("value", (snapshot) => {
        let data = snapshot.val()

        for (let key in data) {
            if (data[key].name == req.body.company) {
                root_db.child("Users").child("Employee").orderByKey().once("value", (snapshot_inner) => {
                    let data_users = snapshot_inner.val()
                    var user_found = false
                    let array_emails = JSON.parse(req.body.email)
                    for (var i=0; i<array_emails.length; i++) {
                        let email = array_emails[i]
                        for (let uid in data_users) {
                            let value = data_users[uid].email
                            if (value == email) {
                                user_found = true
                                var data_json = { }
                                data_json[uid] = email.substring(0, email.indexOf("@"))
                                root_db.child("Companies").child(key).child("groups").child(req.body.group.toLowerCase().replace(" ", "_")).child("members").update(data_json)
                                res.send({"Status": "Success"})
                            } 
                        }
                    }

                    if (!user_found) {
                        res.send({"Status": "Error", "Message": "There is no user with that email ID"})
                    }
                })
            }
        }
    })
})

app.get("/populate-groups", (req, res) => {
    console.log(req.query)
    root_db.child("Users").orderByValue().once("value", (snapshot) => {
        let user_data = snapshot.val()
        var employee_type = ""
        var email_ID_user = ""
        var company_UID = "";

        for (var key in user_data.Employee) {
            if (key == req.query.UID) {
                employee_type = "Employee"
                email_ID_user = user_data.Employee[key].email
                break
            }
        }

        if (employee_type == "") {
            for (var key in user_data.Company) {
                if (key == req.query.UID) {
                    employee_type = "Company"
                    company_UID = key
                    break
                }
            }
        }

        if (employee_type == "") {
            res.send({"Status": "Error", "Message": "User doesn't exist."})
            // process.exit(0)
        } else {
            let domain_name = email_ID_user.substr(email_ID_user.indexOf("@") + 1, email_ID_user.indexOf(".", email_ID_user.indexOf("@") + 1) - email_ID_user.indexOf("@") - 1)
            console.log(domain_name)
            
            if (company_UID == "") {
                for (var key in user_data.Company) {
                    if (user_data.Company[key].company_name.toLowerCase() == domain_name) {
                        company_UID = key
                    }
                }
            }

            if (company_UID == "") {
                res.send({"Status": "Error", "Message": "Company doesn't have an account with us yet."})
            } else {
                root_db.child("Companies").child(company_UID).orderByKey().once("value", (snapshot) => {
                    let data = snapshot.val()
                    // res.send(data)
                    var data_to_send = {
                        "company_name": data.name
                    }

                    if (data.groups == null) {
                        data_to_send.group_data = {}
                    } else if (employee_type == "Company") {
                        data_to_send.group_data = data.groups
                    } else if (employee_type == "Employee") {
                        console.log()
                        console.log()
                        console.log("Employee group data")
                        console.log(data.groups)
                        console.log()
                        console.log()
                        data_to_send.group_data = data.groups

                        for (let group in data.groups) {
                            if (data.groups[group].members == undefined || !(req.query.UID in data.groups[group].members)) {
                                delete data_to_send.group_data[group]
                            }
                        }
                    }

                    console.log(data_to_send)
                    res.send(data_to_send)
                })
            }
            
        }
    })
    // res.send(req.query)
})

app.post("/update-likes", (req, res) => {
    root_db.child("Companies").orderByKey().once("value", (snapshot) => {
        let data = snapshot.val()

        for (let key in data) {
            if (data[key].name == req.body.name) {
                root_db.child("Companies").child(key).child("groups").child(req.body.group_name).child("posts").child(req.body.post_id).update({"likes": parseInt(req.body.updated_likes)})
                res.sendStatus(200)
            }
        }
    })
})

app.post("/add-group", (req, res) => {
    let group_details = req.body;
    console.log("Add group")
    console.log(req.body)

    root_db.child("Companies").child(group_details.uid).child("groups").child(group_details.name.toLowerCase().replace(" ", "_")).set({
        "name": group_details.name,
        "members": null
    })
    res.sendStatus(200)
})

app.post("/make-post", (req, res) => {
    var data = {
        "post_text": req.body.post,
        "timestamp": req.body.timestamp,
        "likes": 0
    }
    console.log("posting")
    console.log(data)
    root_db.child("Companies").orderByKey().once("value", (snapshot) => {
        let val = snapshot.val()

        for (let key in val) {
            if (val[key].name == req.body.company) {
                root_db.child("Users").orderByKey().once("value", (snapshot) => {
                    let data_snap = snapshot.val()
                    var hasFound = 0
                    for (let key in data_snap.Company) {
                        if (key == req.body.uid) {
                            data.username = data_snap.Company[key].email.substring(0, data_snap.Company[key].email.indexOf("@"))
                            data.position = "Company Representative"
                            hasFound = 1
                        }
                    }

                    if (hasFound == 0) {
                        for (let key in data_snap.Employee) {
                            if (key == req.body.uid) {
                                data.username = data_snap.Employee[key].email.substring(0, data_snap.Employee[key].email.indexOf("@"))
                                data.position = data_snap.Employee[key].position
                                hasFound = 1
                            }
                        }
                    }
                    let data_to_send = {
                        "Status": "Success",
                        "post_id": root_db.child("Companies").child(key).child("groups").child(req.body.group).child("posts").push().key
                    }
                    root_db.child("Companies").child(key).child("groups").child(req.body.group).child("posts").push(data)
                    res.send(data_to_send)
                })
            }
        }
    })
})

app.get("/logout", (req, res) => {
    firebase.auth().signOut().then(() => {          
        console.log("User signed out")
        res.send({"Status": "Success"})
    }).catch((error) => {
        if (error != null) {
            console.log(error.message)
            res.send({"Status": "Error", "Message": error.message})
        }
    })
})

app.get("/get-user-details", (req, res) => {
    root_db.child("Users").child(req.query.type).orderByKey().once("value", (snapshot) => {
        let data = snapshot.val()
        console.log("User details")
        console.log(data) 

        for (let key in data)  {
            if (key == req.query.uid && req.query.type == "Employee") {
                var data_to_send = {
                    "position": data[key].position,
                    "username": data[key].email.substring(0, data[key].email.indexOf("@"))
                }
                res.send(data_to_send)
            } else if (key == req.query.uid) {
                var data_to_send = {
                    "position": "Company Representative",
                    "username": data[key].email.substring(0, data[key].email.indexOf("@"))
                }
                res.send(data_to_send)
            }
        }
    })
})

app.post("/authentication", (req, res) => {
    var user_details = req.body.user_details;
    
    console.log("Encoded: " + user_details)
    user_details = Buffer.from(user_details, 'base64');
    //console.log("Decoded: " + user_details)

    user_details = '' + user_details

    let emailID = user_details.substring(0, user_details.indexOf(":"));
    let password = user_details.substring(user_details.indexOf(":")+1);
    let auth_type = req.body.auth_type;

    console.log("Email: " + emailID)

    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(emailID)) {
        res.send({"Status": "Error", "Message": "Invalid Email ID."})
        return
    }
    
    if (password.length < 6) {
        res.send({"Status": "Error", "Message": "Password must be atleast 6 characters."})
        return
    }

    if (req.body.action_type != null && req.body.action_type == "Create") {
        firebase.auth().createUserWithEmailAndPassword(emailID, password).then((authData) => {
            console.log("User created")
            let user = authData.user
            if (user && user.emailVerified === false) {
                user.sendEmailVerification().then(function(){
                    console.log("email verification sent to user");
                    var user_data = {}
                    if (auth_type == "Company") {
                        user_data = {
                            "email": emailID,
                            "uid": user.uid,
                            "company_name": req.body.company_name
                        }
                    } else {
                        user_data = {
                            "email": emailID,
                            "uid": user.uid,
                            "position": req.body.position
                        }
                    }
                    root_db.child("Users").child(auth_type).child(user.uid).update(user_data)
                    
                    if (auth_type == "Company") {
                        user_data = {
                            "name": req.body.company_name,
                            "groups": {}
                        }

                        root_db.child("Companies").child(user.uid).update(user_data)
                    }

                    res.send({"Status": "Success"})
                }).catch((error) => {
                    console.log("Error: " + error.message)
                    res.send({"Status": "Error", "Message": error.message})
                });
            }
        }).catch((error) => {
            if (error != null) {
                console.log(error.message)
                res.send({"Status": "Error", "Message": error.message})
            }
        })
    } else if (req.body.action_type != null && req.body.action_type == "Sign In") {
        firebase.auth().signInWithEmailAndPassword(emailID, password).then((authData) => {
            let user = authData.user
            if (user && user.emailVerified === false) {     
                res.send({"Status": "Error", "Message": "Unverified Email Address."})
            } else {
                root_db.child("Users").child(auth_type).once('value', (snap) => {
                    var is_signed_in = 0;
                    snap.forEach((node) => {
                        if (node.key == user.uid) {
                            console.log("User signed in")
                            res.send({"Status": "Success", "UID": user.uid})
                            is_signed_in = 1;
                        }
                    })
                    if (is_signed_in == 0) {
                        res.send({"Status": "Error", "Message": "This account is of a different type."})
                        firebase.auth().signOut()
                    }
                })
            }
        }).catch((error) => {
            if (error != null) {
                console.log(error.message)
                res.send({"Status": "Error", "Message": error.message})
            }
        })

    }
})
