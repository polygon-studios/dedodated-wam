/**
 * about/index.js
 * ----------------------------------
 * Handles GET & POST requests from the '/about' url
 * Serves the marketing website and loads in dynamic game information
 * @router
 */


// #
// # Load in dependencies
// #

var express = require('express'),
    http = require('http');
var router = express.Router();



router.get('/', function(req, res) {
    res.render('dashboard/index', { title: 'Dashboard | Pyjama Jam',
                                    error: req.query.error });

});

module.exports = router;
