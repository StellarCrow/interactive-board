const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/test-board',  { useNewUrlParser: true });


let User = require('../models/User');

process.env.SECRET_KEY = 'secret';

router.get('/', function(req, res) {
    res.send("Hallo!");
});

router.post('/register', function (req, res) {
    res.send(`${req.body.email} Registered!`);
});

router.post('/registration', function (req, res) {
    let userData = {
        username: req.body.username,
        firstName: req.body.firstName || "",
        lastName: req.body.lastName || "",
        email: req.body.email,
        password: req.body.password
    };
    User.findOne({
        username: req.body.username
    }, function (user) {
        if(!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                console.log("HASH: " + hash);
                userData.password = hash;
                User.create(userData)
                    .then(user => {
                        res.json({status: user.email + " registered"});
                    })
                    .catch(err => {
                        res.send("Error: " + err)
                    })
            })
        } else {
            res.json({
                error: "User already exists"
            })
        }
    })
        .catch(err => {
            res.send('error: ' + err);
        })
});

router.post("/login", function (req, res) {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                };
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                res.send(token);
            }
            else {
                res.json({error: "User doesn't exist"})
            }
        } else {
            res.json({error: "User doesn't exist"})
        }
    })
        .catch(err => {
            res.send("error: " + err);
        })
});

module.exports = router;