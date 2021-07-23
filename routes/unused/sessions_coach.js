const express = require('express');
const router = express.Router();
const connection = require('../../config/db.connection.js');

const moment = require('moment');

// route - gets all sessions of coach - id is coachId
router.get('/', (req, res) => {

    if(req.session.coach){
        var coachId = req.session.coach[0].id;
        console.log("in session get")
        console.log(req.session.coach[0].id);   
        connection.query('SELECT * FROM sessions WHERE coachid = ? ORDER BY date', [coachId], function(err, results, field){
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
                res.json({msg: "Coach does not have any sessions"});
            }
        })
    }else{
        res.send({msg: "not authorized"});
    }
})

// get specific session by id - req.params.id
router.get('/:id', (req,res) => {
    if(req.session.coach){
        connection.query('SELECT * FROM sessions WHERE id = ?', [req.params.id], function(err, results, field){
            if(err){
                console.log(err);
                res.json({msg: "error on query"});
            }

            console.log(results);
            let date = moment(results[0].date).format('DD/MM/YYYY');
            results[0].date = date;
            results[0].starttime = results[0].starttime.toString().slice(0, -3);  // cut off seconds - 18:00:00 -> 18:00
            results[0].endtime = results[0].endtime.toString().slice(0, -3);
            console.log(results[0].starttime)
            res.json({session: results});
        })
    }else{
        res.json({msg: "not authorized"});
    }
})

// Create session
router.post('/', (req, res) => {
    console.log("in session post");

    if(req.session.coach){
        var coachid = req.session.coach[0].id;
        var date = req.body.date; 
        var starttime = req.body.starttime;
        var endtime = req.body.endtime;
        var game = req.body.game;
        var description = req.body.description

        if(date && starttime && endtime && coachid){
            console.log(date, starttime, endtime, game, description);
            
            connection.query('INSERT INTO sessions(coachid,date,starttime,endtime,game,description,studentid) VALUES (?,?,?,?,?,?,NULL)', 
            [coachid, date, starttime, endtime, game, description], function(err, results, fields){
                if(err){
                    console.log(err);
                    res.json({error: true, msg: "error on inserting"});
                }

                // if inserted correctly
                console.log(results);
                res.json({error: false, msg: "inserted session"});
            })
        }else{
            console.log("data missing");
            res.json({error: true, msg: "Please enter all the data"});
        }
    }else{
        res.json({error: true, msg: "not authorized"});
    }
})

//delete session 
router.delete('/', (req, res) => {
    var id = req.body.id;
    console.log(req.body);

    if(req.session.coach){
        if(id){
            connection.query('DELETE FROM sessions WHERE id = ?', [id], function(err, results, fields){
                if(err){
                    console.log(err);
                    res.json({success: false, msg: "error on deleting"});
                }

                console.log(results);
                res.json({success: true, msg: "deleted session"});
                
            })
        }else{
            res.json({msg: "Please give an id"});
        }
    }else{
        res.json({msg: "not authorized"});
    }
})

module.exports = router;