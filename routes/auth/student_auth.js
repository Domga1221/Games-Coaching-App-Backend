const express = require('express');
const router = express.Router();
const connection = require('../../config/db.connection.js');

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// route - when already loggedIn with cookie
router.get('/login', (req, res) => {
    if(req.session.student){ // cookie schon hinterlegt? session dafür vorhanden?
        console.log("in get login");
        console.log(req.session.student)
        res.send({loggedIn: true, student: req.session.student});
    }else{
        res.send({loggedIn: false});
    }
})

// route - login for student
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    connection.query("SELECT * FROM students WHERE email = ?", [email], (err, result) => {
        if(err){
            console.log(err);
            res.send(err);
        }

        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(response){
                    req.session.student = result; // ???
                    console.log(req.session.student);
                    res.send({success: true});
                }else{
                    res.send({success: false, message: "Wrong email/password combination"});
                }
            });
        }else{
            res.send({success: false, message: "Student does not exist"});
        }
    })
})

// logout for student
router.delete('/logout', (req, res)=> {
    if(req.session.student){
        req.session.destroy(err =>{
            if(err){
                res.send({logout: false, message: "Could not log out, error"});
            }else{
                res.send({logout: true, message: "logout successful"});
            }
        })
    }else{
        res.send({logout: false, message: "something went wrong..."});
    }
})

// route - register for student
router.post('/register', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
            res.send({success: false, message: "Error on hashing"});
        }

        connection.query("INSERT INTO students (email, password) VALUES (?,?)", [email, hash], (err, result) => {
            if(err){
                console.log(err);
                res.send({success: false, message: "Error on inserting into db"});
            }else{
                res.send({success: true, message: "Succesfully inserted"});
            }
        });
    });
})

module.exports = router;