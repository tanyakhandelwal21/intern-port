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

app.listen(process.env.PORT || 1337, () => console.log("Server is listening"))

app.post("/authentication", (req, res) => {
    let body = req.body;

    let email = body.email;
    let password = body.password;

    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
        if (error != null) {
            console.log(error.message)
            return
        }
    })
})