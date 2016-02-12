/**
 * about.js
 * ----------------------------------
 * Handles GET & POST requests from the /about url
 * Provides database connections
 * @router
 */


var express = require('express'),
    http = require('http');
var router = express.Router();



router.get('/', function(req, res) {
    console.log("Trying to access homepage");

    res.render('about/index', { title: 'Welcome to Pyjama Jam!',
                              error: req.query.error });

});

module.exports = router;
