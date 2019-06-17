const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://interactive:board2425@ds137857.mlab.com:37857/interactive-board-db',  { useNewUrlParser: true });

console.log(mongoose.connection.readyState);



let User = require('../models/User');


process.env.SECRET_KEY = 'secret';

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: ONE_WEEK
    });
}


router.post('/registration', function (req, res) {
    let userData = {
        username: req.body.username,
        fullName: req.body.fullName || "",
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
                        const payload = {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            password: user.password
                        };
                        let token = jwtSignUser(payload);
                        return res.send({
                            user: payload,
                            token: token
                        });
                        //res.json({status: user.email + " registered"});
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
    console.log("USERNAME: " + req.body.username);
    User.findOne({
        username: req.body.username
    }).then(user => {
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    password: user.password
                };
                let token = jwtSignUser(payload);
                res.send({
                    user: payload,
                    token: token
                });
            }
            else {
                res.json({error: "Wrong password"})
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