const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/test-board');

router.get('/', function(req, res) {
    res.send("Hallo!");
});

router.post('/register', function (req, res) {
    res.send(`${req.body.email} Registered!`);
});



module.exports = router;