const express = require('express');
const router = express.Router();
//mongoose.connect('mongodb://localhost/test-board');

let User = require('../models/User');
let Board = require('../models/Board');

router.get('/:id', function (req, res) {
    let objects = {
        boards: null,
        user: null
    }
    let id = req.params.id;
    console.log("USER PAGE PARAMS ID " + id);
    Board.find({author: id}, function (boards) {
        if(boards) {
            objects.boards = boards;
        }
        else {
            objects.boards = null;
        }
    }).catch(err => {
        res.send("Error" + err);
    });

    User.findOne({_id: id}, function (err, user) {
        if(err) {
            return res.send("Error" + err);
        }
        if(user) {
            objects.user = user;
            return res.send(objects);
        }
    })
});

module.exports = router;