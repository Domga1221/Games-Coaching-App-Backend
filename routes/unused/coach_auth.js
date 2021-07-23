const express = require('express');
const dbConfig = require('../../config/db.config.js');
const router = express.Router();
const connection = require('../../config/db.connection.js');

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// route - when already loggedIn with cookie
router.get('/login', (req, res) => {
    if(req.session.coach){ // cookie schon hinterlegt? session dafür vorhanden?
        console.log(req.session.coach)
        res.send({loggedIn: true, coach: req.session.coach});
    }else{
        res.send({loggedIn: false});
    }
})

// route - login for coach
router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    connection.query("SELECT * FROM coaches WHERE email = ?", [email], (err, result) => {
        if(err){
            console.log(err);
            res.send(err);
        }

        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (err, response) => {
                if(response){
                    req.session.coach = result; // ???
                    console.log(req.session.coach);
                    res.send({success: true});
                }else{
                    res.send({message: "Wrong email/password combination"});
                }
            });
        }else{
            res.send({message: "Coach does not exist"});
        }
    })
})

// logout for coach
router.delete('/logout', (req, res)=> {
    if(req.session.coach){
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

// route - register for coach
router.post('/register', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err);
            res.send({success: false, message: "Error on hashing"});
        }

        connection.query("INSERT INTO coaches (email, password) VALUES (?,?)", [email, hash], (err, result) => {
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