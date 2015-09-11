/**
 * index.js
 * ----------------------------------
 * Handles requests from the /admin url
 * Provides admin server functionality for the game
 * @router
 */


var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mc = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var notesCollection, usersCollection;

mc.connect('mongodb://127.0.0.1/test-mongo', function(err, db) {
    console.log("Attempting to connect");
    if (err) {
        throw err;
    }
    
    notesCollection = db.collection('notes');
    usersCollection = db.collection('users');
    console.log("Connected to DBs");
});

router.post('/register', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var checkInsert = function(err, newUsers) {
        if (err) {
            res.redirect("/?error=Unable to add user");
        } else {
            res.redirect("/?error=User " + username +
                         " successfully registered");
        }
    }

    var checkUsername = function(err, user) {
        if (err) {
            res.redirect("/?error=unable to check username");
        } else if (user === null) {
            var newUser = {
                username: username,
                password: password
            };
            usersCollection.update({username: username},
                                   newUser,
                                   {upsert: true},
                                   checkInsert);    

        } else {
            res.redirect("/?error=user already exists");
        }
    }
    
    usersCollection.findOne({username: username}, checkUsername);
});

router.get('/', function(req, res) {
    console.log("Trying to access homepage");
    if (req.session.username) {
        res.redirect("/notes");
    } else {
        res.render('index', { title: 'COMP 2406 Exam Notes Demo', 
                              error: req.query.error });
    }
});

router.get('/notes', function(req, res) {
    var username = req.session.username;

    if (username) {
        res.render("notes.jade", {username: username,
                                  title: username +"'s Notes"});
    } else {
        res.redirect("/?error=Not Logged In");
    }
});

router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    var authenticateUser = function(err, user){
        if (err || user === null || password !== user.password) {
            res.redirect("/?error=invalid username or password");       
        } else {
            req.session.username = username;
            res.redirect("/notes");
        }
    }
    
    usersCollection.findOne({username: username}, authenticateUser);
});

router.post('/logout', function(req, res) {
    req.session.destroy(function(err){
        if (err) {
            console.log("Error: %s", err);
        }
    });
    res.redirect("/");
});

router.get('/getNotes', function(req, res) {
    var username = req.session.username;

    var renderNotes = function(err, notes) {
        if (err) {
            notes = [{"title": "Couldn't get notes",
                      "owner": username,
                      "content": "Error fetching notes!"}];
        }
        res.send(notes);
    }
    
    if (username) {
        notesCollection.find({owner: username}).toArray(renderNotes);
    } else {
        res.send([{"title": "Not Logged In",
                   "owner": "None",
                   "content": "Nobody seems to be logged in!"}]);
    }    
});

router.post('/updateNote', function(req, res) {
    var username = req.session.username;
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    
    var checkUpdate = function(err, result) {
        if (err) {
            res.send("ERROR: update failed");
        } else {
            res.send("update succeeded");
        }
    }
    
    if (username) {
        if (id && title && content) {
            notesCollection.update({_id: ObjectID(id)},
                                   {$set: {title: title,
                                           content: content}},
                                   checkUpdate);
        } else {
            res.send("ERROR: bad parameters");
        }
    } else {
        res.send("ERROR: not logged in");
    }
});

router.post('/newNote', function(req, res) {
    var username = req.session.username;
    var newNote;

    var reportInserted = function(err, notesInserted) {
        if (err) {
            res.send("ERROR: Could not create a new note");
        } else {
            res.send(notesInserted[0]._id);
        }
    }

    if (username) {
        newNote = {title: "Untitled",
                   owner: username,
                   content: "No content"};

        notesCollection.insert(newNote, reportInserted);
    } else {
        res.send("ERROR: Not Logged In");
    }
});



module.exports = router;
