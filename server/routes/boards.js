const express = require('express');
const AWS = require('aws-sdk');
let multer  = require('multer');
let upload = multer();
const router = express.Router();

let Note = require('../models/Note');
// let Image = require('../models/Image');
let Media = require('../models/Media');
let Board = require('../models/Board');
let User = require('../models/User');

const config = require('../config/config');

const BUCKET_NAME = 'interactive-board';
const IAM_USER_KEY = config.iamUser;
const IAM_USER_SECRET = config.iamSecret;

function uploadToS3(file, user) {
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
    });
    s3bucket.createBucket(function () {
        let params = {
            Bucket: BUCKET_NAME,
            Key: `${user._id}/${Date.now().toString()}` ,
            Body: file.data,
        };
        s3bucket.upload(params, function (err, data) {
            if (err) {
                console.log('error in callback');
                console.log(err);
            }
            console.log('success');
            console.log(data);
            console.log(data.Location);
        });
    });
}

router.post('/saveBoard', function (req, res, next) {
    let id = req.body.idb;
    let notesUpdated = req.body.notes; //Array[obj, obj]

    Board.findOneAndUpdate({_id: id}, {
        name: req.body.name,
        is_public: req.body.is_public,
        background: req.body.background
    }, function (err, board) {
        if(err) return next(err);
        if(board) {
            for(let i = 0; i < notesUpdated.length; i++) {
                Media.findOneAndUpdate({_id: notesUpdated[i].id}, {
                    coordinates: notesUpdated[i].coordinates
                }, function (err) {
                    if(err) return next(err);
                });

                if(i === notesUpdated.length - 1) {
                    return res.send({message: "Successfully updated."});
                }
            }
        }
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
            data.background = board.background;
        }
        else {
            return res.send({board: null});
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
                    objNote.id = media._id;
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

                    return res.send({id: media._id});
                }
            });
        })
    })
});

router.post('/uploadImage/:id', upload.single('photo'), function (req, res, next) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if(err) return next(err);
        if(user) {
            uploadToS3(req.files.photo, user);
        }
        else {
            return res.send({message: "Error while trying to find User"});
        }
    });
});

module.exports = router;