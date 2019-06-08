const express = require('express');
const router = express.Router();
//mongoose.connect('mongodb://localhost/test-board');

let User = require('../models/User');
let Board = require('../models/Board');


router.get('/getAll', function (req, res, next) {
    User.find({}, function (err, users) {
        if(err) return next(err);
        if(users) {
            return res.send({users: users});
        }
    })
});

router.get('/:id', function (req, res, next) {
   let id = req.params.id;

   User.findById(id, function (err, user) {
       if(err) return next(err);
       if(user) {
           return res.send(user);
       }
       else {
           return res.sendStatus(404);
       }
   })
});

router.get('/:id/getBoards', async function (req, res, next) {
    let objects = {
        boards: null,
        user: null
    };
    let id = req.params.id;
    console.log("USER PAGE PARAMS ID " + id);
    await Board.find({author: id}, function (err, boards) {
        if(err) return next(err);
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

router.post('/:id/createBoard', function (req, res, next) {
    let id = req.params.id;
    Board.create({
        author: id
    }, function (err, board) {
        if(err) return next(err)
        if(board) {
            User.findOne({_id: id}, function (err, user) {
                if(err) return next(err);
                if(user) {
                    user.boards.push(board);
                    user.save(function (err) {
                        if(err) return next(err)
                    })
                }
            });
            return res.send({boardId: board._id});
        }
    })
});


router.post('/update', function (req, res, next) {
   let id = req.body.id;
   let fullName = req.body.fullName;
   let description = req.body.description;
   let avatar = req.body.avatar;

   User.findOneAndUpdate({_id: id}, {
       fullName: fullName,
       description: description,
       avatar: avatar
   }, function (err, user) {
       if(err) return next(err);
       if(user) {
           return res.send({message: "Успешно обновлено"})
       }
       else {
           return res.send({message: "Ошибка при сохранении."})
       }
   })
});

module.exports = router;