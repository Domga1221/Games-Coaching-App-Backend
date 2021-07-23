const express = require('express');
const router = express.Router();
const connection = require('../../config/db.connection.js')

const students = require('../../Students');

// route - gets one student
router.get('/:id', (req, res) => {
    if(req.session.coach){
        console.log(req.params.id);
        connection.query('SELECT name, email, phone, discord FROM students WHERE id = ?', [req.params.id], (err, result) => {
            if(err){
                res.json({msg: "error on query"});
            }
            console.log(result)
            res.json({student: result});
        })
    }else{
        res.json({msg: "not authorized"});
    }
})





module.exports = router;