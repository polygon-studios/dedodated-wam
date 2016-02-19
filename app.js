/**
 * App.js
 * ----------------------------------
 * Creates the express application to
 * listen for incoming connections
 * @constructor
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mobilia   = require('./controllers/mobilia/index');
var stats     = require('./controllers/stats');
var admin     = require('./controllers/admin/index');
var about     = require('./controllers/about/index');
var dashboard = require('./controllers/dashboard/index');

var app = express();

/*
app.httpsOptions = {
    key: fs.readFileSync('./keys/comp2406-private-key.pem'),
    cert: fs.readFileSync('./keys/comp2406-cert.pem')
};
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: "We need a better secret!",
    store: new MongoStore({url: 'mongodb://127.0.0.1/test-mongo'}),
    resave: false,
    saveUninitialized: true
  }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mobilia);
app.use('/admin', admin);
app.use('/admin/:page', admin);
app.use('/stats', stats);
app.use('/about', about);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    app.locals.pretty = true;
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
