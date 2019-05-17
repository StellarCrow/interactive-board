const express = require('express');
const router = express.Router();

let Note = require('../models/Note');
let Media = require('../models/Media');
let Board = require('../models/Board');

router.post('/saveBoard', function (req, res, next) {
    let id = req.body.idb;

    Board.findOneAndUpdate({_id: id}, {
        name: req.body.name,
        is_public: req.body.is_public
    }, function (err, board) {
        if(err) return next(err);
        if(board) {
            res.status(200);
        }
    })
});

router.post('/createNote', function (req, res, next) {
    let bid = req.body.boardId;
    let coord = req.body.coordinates;
    Note.create({
        text: req.body.text,
        color: req.body.color
    }, function (err, note) {
        if (err) return next(err);
        Media.create({
            type: note._id,
            board: bid,
            coordinates: coord
        }, function (err, media) {
            if (err) return next(err);
            Note.findOneAndUpdate({_id: note._id}, {
                media: media._id
            }, function (err) {
                if (err) return next(err);
            });

            Board.findOne({_id: bid}, function (err, board) {
                if (err) return next(err);
                if (board) {
                    board.notes.push(media);
                    board.save(function (err) {
                        if (err) return next(err);
                    });

                    return res.send(200);
                }
            });
        })
    })
});

router.get('/:id/getData', function (req, res, next) {
    let bid = req.params.id;
    let notesArray = [];
    let data = {};

    Board.findOne({_id: bid}, function (err, board) {
        if(err) return next(err);
        if(board) {
            data.bname = board.name;
            data.is_public = board.is_public;
        }
    });

     Board.findOne({_id: bid}).distinct('notes', function (err, notes) {
        if (err) return next(err);
         for(let i = 0; i < notes.length; i++) {
            let objNote = {};
            console.log(notes[i]);
            Media.findOne({_id: notes[i]}, function (err, media) {
                if (err) return next(err);
                if (media) {
                    objNote.coordinates = media.coordinates;
                    Note.findOne({_id: media.type}, function (err, note) {
                        if (err) return next(err);
                        if (note) {
                            objNote.color = note.color;
                            objNote.text = note.text;

                            notesArray.push(objNote);
                            console.log("ObjNote " + objNote);
                            console.log("noteArray " + notesArray);

                            if(i === notes.length - 1) {
                                console.log("NA: " + notesArray);
                                return res.send({notesArray: notesArray, board: data});
                            }
                        }
                    })
                }
            })
        }
    });
});

module.exports = router;