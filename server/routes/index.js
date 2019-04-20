const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send("Hallo!");
});

router.post('/register', function (req, res) {
    res.send(`${req.body.email} Registered!`);
});



module.exports = router;