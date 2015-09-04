var express = require('express');
var router = express.Router();
var debug = require('debug')('worker');

var state = [];

router.get('/', function(req, res, next) {
	// Doesn't render index page
  res.render('index', { title: 'COMP 2406 Simple form demo' });
  debug('Rendering the main page');
});

router.post('/add', function(req, res) {
    var obj = { name: req.body.name,
		city: req.body.city,
                country: req.body.country,
                birthday: req.body.birthday,
                email: req.body.email };
    state.push(obj);
    res.render('add', { title: 'Person just added', item: obj });
});

router.get('/list', function(req, res) {
    res.render('list', { title: 'People Listing',  items: state});
});

// Webpage not available
module.exports = router;
