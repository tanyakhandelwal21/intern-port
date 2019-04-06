const express = require('express')
const bodyParser = require('body-parser')
const firebase_import = require('firebase/app')
const app = express().use(bodyParser.json())
const firebase = firebase_import.initializeApp({
    apiKey: "AIzaSyBLCNm6VDYqb_lrN88SW7BlWUFCGYXKaA4",
    authDomain: "intern-port.firebaseapp.com",
    databaseURL: "https://intern-port.firebaseio.com",
    projectId: "intern-port",
    storageBucket: "",
    messagingSenderId: "780912934069"
})

require('firebase/auth')
require('firebase/database')

const root_db = firebase.database().ref()

app.listen(process.env.PORT || 1337, () => console.log("Server is listening"))
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/authentication", (req, res) => {
    var user_details = req.body.user_details;
    
    console.log("Encoded: " + user_details)
    user_details = Buffer.from(user_details, 'base64');
    console.log("Decoded: " + user_details)

    user_details = '' + user_details

    let emailID = user_details.substring(0, user_details.indexOf(":"));
    let password = user_details.substring(user_details.indexOf(":")+1);
    let auth_type = req.body.auth_type;

    console.log("Email: " + emailID)

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
                    let user_data = {
                        "email": emailID,
                        "uid": user.uid
                    }
                    root_db.child("Users").child(auth_type).child(user.uid).update(user_data).catch((error) => {
                        console.log("error adding to db")
                        //res.send({"Status": "Error", "Message": error.message})
                    })
                    res.send({"Status": "Success"})
                }).catch((error) => {
                    console.log("Error in sending verification email: " + error.message)
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
                res.send({"Status": "Error", "Message": "Unverified Email Address"})
            } else {
                console.log("User signed in")
                res.send({"Status": "Success", "UID": user.uid})
            }
        }).catch((error) => {
            if (error != null) {
                console.log(error.message)
                res.send({"Status": "Error", "Message": error.message})
            }
        })

    } else if (req.body.action_type != null && req.body.action_type == "Sign Out") {
        firebase.auth().signOut().then(() => {          
            console.log("User signed out")
            res.send({"Status": "Success"})
        }).catch((error) => {
            if (error != null) {
                console.log(error.message)
                res.send({"Status": "Error", "Message": error.message})
            }
        })

    } 
})