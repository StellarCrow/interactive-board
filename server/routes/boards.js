const express = require('express');
const AWS = require('aws-sdk');
let multer = require('multer');
let upload = multer();
const router = express.Router();

let Note = require('../models/Note');
let Image = require('../models/Image');
let Media = require('../models/Media');
let Board = require('../models/Board');

const config = require('../config/config');

const BUCKET_NAME = 'interactive-board';
const IAM_USER_KEY = config.iamUser;
const IAM_USER_SECRET = config.iamSecret;

function uploadToS3(file, board) {
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
    });
    let params = {
        Bucket: BUCKET_NAME,
        Key: `${board._id}/${Date.now().toString()}.jpg`,
        Body: file.data
    };

    let s3UploadPromise = new Promise(function (resolve, reject) {
        s3bucket.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                console.log('success');
                console.log(data);

                Image.create({
                    link: data.Location
                }, function (err, image) {
                    if (err) {
                        console.log(err);
                        resolve(-1);
                    }
                    if (image) {
                        console.log("IM IN PROMISE. id = " + image._id);
                        resolve(image);
                    }
                    else resolve(-1);
                });
            }
        });
    });

    return s3UploadPromise;
}

router.post('/saveBoard', function (req, res, next) {
    let id = req.body.idb;
    let notesUpdated = req.body.notes; //Array[obj, obj]
    let imagesUpdated = req.body.images;
    let promiseNotes, promiseImages;


    Board.findOneAndUpdate({_id: id}, {
        name: req.body.name,
        is_public: req.body.is_public,
        background: req.body.background
    }, function (err, board) {
        if (err) return next(err);
        if (board) {

            promiseNotes = new Promise(resolve => {
                if(notesUpdated.length === 0) resolve("There are no notes");
                for (let i = 0; i < notesUpdated.length; i++) {
                    Media.findOneAndUpdate({_id: notesUpdated[i].id}, {
                        coordinates: notesUpdated[i].coordinates
                    }, function (err) {
                        if (err) return next(err);
                    });

                    if (i === notesUpdated.length - 1) {
                        resolve("Notes updated");
                    }
                }
            });

            promiseImages = new Promise(resolve => {
                if(imagesUpdated.length === 0) resolve("There are no images");
                for(let j = 0; j < imagesUpdated.length; j++) {
                    Media.findOneAndUpdate({_id: imagesUpdated[j].id}, {
                        coordinates: imagesUpdated[j].coordinates
                    }, function (err) {
                        if(err) return next(err);
                    });

                    if(j === imagesUpdated.length - 1) {
                        resolve("Images Updated");
                    }
                }

                return Promise.all([promiseNotes, promiseImages])
                    .then(array => {
                        console.log("UPDATED " + array[0] + "  " + array[1]);
                        return res.send({message: `${array[0]} and ${array[1]}`});
                    })
            });
        }
    });
});

router.get('/:id/getData', function (req, res, next) {
    let bid = req.params.id;
    let notes, images;
    let notesArray = [];
    let imagesArray = [];
    let data = {};

    Board.findOne({_id: bid}, function (err, board) {
        if (err) return next(err);
        if (board) {
            data.bname = board.name;
            data.is_public = board.is_public;
            data.background = board.background;
        }
        else {
            return res.send({board: null});
        }
    });

    //REJECT EMPTY OBJCTS
    let findNotes = new Promise((resolve => {
        Board.findOne({_id: bid}, function (err, board) {
            if (err) return next(err);
            if (board) {
                notes = board.notes;
                if(notes.length === 0) return resolve(notesArray);
                for (let i = 0; i < notes.length; i++) {
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

                                    if (i === notes.length - 1) {
                                        console.log("NA: " + notesArray);
                                        resolve(notesArray);
                                        //return res.send({notesArray: notesArray, board: data});
                                    }
                                }
                            })
                        }
                    })
                }
            }
        });
    }));


    let findImages = new Promise((resolve => {
        Board.findOne({_id: bid}, function (err, board) {
            if (err) return next(err);
            if (board) {
                images = board.images;
                if(images.length === 0) return resolve(imagesArray);
                console.log("IMAGES L: " + images.length);
                for (let j = 0; j < images.length; j++) {
                    let objImage = {};
                    Media.findOne({_id: images[j]}, function (err, media) {
                        if (err) return next(err);
                        if (media) {
                            objImage.coordinates = media.coordinates;
                            objImage.id = media._id;
                            Image.findOne({_id: media.type}, function (err, image) {
                                if (err) return next(err);
                                if (image) {
                                    objImage.color = image.color;
                                    objImage.name = image.name;
                                    objImage.imageType = image.type;
                                    objImage.link = image.link;

                                    imagesArray.push(objImage);

                                    if (j === images.length - 1) {
                                        console.log("IA " + imagesArray);
                                        resolve(imagesArray);
                                    }
                                }
                            })
                        }
                    })
                }
            }
        });
    }));

    return Promise.all([findNotes, findImages])
        .then(array => {
            console.log(array[1]);
            return res.send({notesArray: array[0], imagesArray: array[1], board: data});
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
    let bid = req.params.id;

    Board.findOne({_id: bid}, function (err, board) {
        if (err) return next(err);
        if (board) {
            let image = uploadToS3(req.files.photo, board);
            image.then((result) => {
                console.log("RESULT" + result._id);

                res.send({imageId: result._id});
            });
        }
        else {
            return res.send({imageId: -1});
        }
    });
});

router.post('/createImage', function (req, res, next) {
    let bid = req.body.bid;
    let image = req.body.image;
    let iid = req.body.imageId;

    Media.create({
        type: iid,
        board: bid,
        coordinates: image.coordinates
    }, function (err, media) {
        if (err) return next(err);
        if (media) {
            Board.findOne({_id: bid}, function (err, board) {
                if (err) return next(err);
                if (board) {
                    board.images.push(media);
                    board.save(function (err) {
                        if (err) return next(err);
                    });
                }
            });

            Image.findOneAndUpdate({_id: iid}, {
                media: media._id,
                color: image.color,
                name: image.name,
                type: image.imageType
            }, function (err, imageInst) {
                if (err) return next(err);
                if (imageInst) {
                    return res.send({imageLink: imageInst.link, media: media._id});
                }
            });
        }
    })
});

module.exports = router;