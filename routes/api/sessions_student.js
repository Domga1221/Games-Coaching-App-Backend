const express = require('express');
const router = express.Router();
const connection = require('../../config/db.connection.js');

const moment = require('moment');
const path = require('path');

// route - gets all available sessions
router.get('/all/:game', (req, res) => {

    if(req.session.student){
        console.log("in session get")
        console.log(req.session.student[0].id);  
        
        console.log(req.params.game);

        let game = req.params.game;

        connection.query(`select s.*, c.name from sessions s inner join coaches c on (s.coachid = c.id) where studentid IS NULL and game = ? ORDER BY DATE`, [game], 
        function(err, results, field){
            if(err){
                console.log(err);
                res.json({msg: "error on query"});
            }

            // are there any sessions?
            if(results.length > 0){
                console.log(results);

                // ISOString -> date 
                // 2021-02-09T23:00:00.000Z -> 10/02/2021
                let date;
                for(let i = 0; i < results.length; i++){
                    date = moment(results[i].date).format('DD/MM/YYYY');
                    console.log(date);
                    results[i].date = date; // date setzen, zuschicken

                    results[i].starttime = results[i].starttime.toString().slice(0, -3); // cut off seconds
                    results[i].endtime = results[i].endtime.toString().slice(0, -3);
                }

                res.json({sessions: results});
            }else{
                console.log(results);
                res.json({msg: "There are no available sessions"});
            }
        })
    }else{
        res.send({msg: "not authorized"});
    }
})


// route - gets all sessions booked by student
router.get('/booked', (req, res) => {

    if(req.session.student){
        var studentId = req.session.student[0].id;
        console.log("in session get")
        console.log(req.session.student[0].id);   

        connection.query('select s.*, c.name from sessions s inner join coaches c on (s.coachid = c.id) where studentid = ? ORDER BY date', [studentId], function(err, results, field){
            if(err){
                console.log(err);
                res.json({msg: "error on query"});
            }

            // does coach have sessions?
            if(results.length > 0){
                console.log(results);

                // ISOString -> date 
                // 2021-02-09T23:00:00.000Z -> 10/02/2021
                let date;
                for(let i = 0; i < results.length; i++){
                    date = moment(results[i].date).format('DD/MM/YYYY');
                    console.log(date);
                    results[i].date = date; // date setzen, zuschicken

                    results[i].starttime = results[i].starttime.toString().slice(0, -3); // cut off seconds
                    results[i].endtime = results[i].endtime.toString().slice(0, -3);
                }

                res.json({sessions: results});
            }else{
                res.json({msg: "There are no available sessions"});
            }
        })
    }else{
        res.send({msg: "not authorized"});
    }
})

// route - book a specific sessions
router.post('/book', (req, res) => {

    if(req.session.student){
        var studentId = req.session.student[0].id;
        var sessionId = req.body.sessionId;

        console.log("in book");
        console.log("studentid: " + studentId);   
        console.log("sessionid: " + sessionId);

        
        connection.query('Update sessions SET studentid = ? WHERE id = ?', [studentId, sessionId], function(err, results, field){
            if(err){
                console.log(err);
                res.json({success: false, msg: "error on Update"});
            }

            console.log(results);
            res.send({success: true, results});
        })

        

    }else{
        res.send({msg: "not authorized"});
    }
})


// route - cancel booking of a specific sessions
router.post('/cancel', (req, res) => {

    if(req.session.student){
        var studentId = req.session.student[0].id;
        var sessionId = req.body.sessionId;

        console.log("in cancel");
        console.log("studentid: " + studentId);   
        console.log("sessionid: " + sessionId);

        
        connection.query('Update sessions SET studentid = NULL WHERE id = ?', [sessionId], function(err, results, field){
            if(err){
                console.log(err);
                res.json({success: false, msg: "error on Update"});
            }

            console.log(results);
            res.send({success: true, results});
        })

        

    }else{
        res.send({msg: "not authorized"});
    }
})  

router.get('/coaches/:coachId', (req, res) => {

    if(req.session.student){
        var studentId = req.session.student[0].id;
        var coachId = req.params.coachId;
        console.log("in get coach");
        console.log("studentid: " + studentId);
        console.log("coachid: " + coachId);


        connection.query('SELECT name, email, phone, discord, id FROM coaches WHERE id = ?', [coachId], function(err, results, field){
            if(err){
                console.log(err);
                res.json({success: false, msg: "error on querying coach"});
            }

            console.log(results);
            res.send({coach: results});
        })


    }else{
        res.send({msg: "not authorized"});
    }
})




// get image of coach
router.get('/coaches/image/:coachId', (req, res) => {
    
    let coachId = req.params.coachId;
    console.log("in get image");
    console.log("coachId: " + coachId);
    
    res.sendFile(path.join(__dirname, './coachImages', coachId +'.png'), (err) => {
        if(err){
            console.log("error sending image");
            console.log(err);
            res.send({msg: 'error sending file'});
        } else{
            console.log("sent file: " + coachId +'.png');
        }
    });


})




module.exports = router;