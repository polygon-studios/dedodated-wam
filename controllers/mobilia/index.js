/**
 * mobilia/index.js
 * ----------------------------------
 * Handles GET & POST requests from the '/play' base url
 * Serves the mobile web app and routes database requests
 * @router
 */


// #
// # Load in dependencies
// #

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mc = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;

var notesCollection, usersCollection;


// #
// # Connect to DB
// #

mc.connect('mongodb://127.0.0.1/test-mongo', function(err, db) {
    if (err) {
        throw err;
    }

    notesCollection = db.collection('notes');
    usersCollection = db.collection('users');
});



/**
 & GET Functions
 & ----------------------------------
**/


// # Load homepage
router.get('/', function(req, res) {
    if (req.session.username) {
        res.redirect("play/mobilia");
    } else {
        res.render('index', { title: 'Pyjama Jam',
                              error: req.query.error });
    }
});


// # Load in mobile web app
router.get('/mobilia', function(req, res) {
    var username = req.session.username;

    if (username) {
        res.render("mobilia.jade", {username: username});
    } else {
        res.redirect("/?error=You need a name first!");
    }
});


/**
 & POST Functions
 & ----------------------------------
**/

router.post('/login', function(req, res) {
    var username = req.body.username;

    console.log("Username: %s", username);
    req.session.username = username;
    res.redirect("/play/mobilia");
});

router.post('/play/logout', function(req, res) {
    req.session.destroy(function(err){
        if (err) {
            console.log("Error: %s", err);
        }
    });
    res.redirect("/");
});


module.exports = router;
