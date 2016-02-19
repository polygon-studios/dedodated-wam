/**
 * admin/users.js
 * ----------------------------------
 * Handles database user interactions for the admin interface
 * @model
 */


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
    console.log("Connected to DBs");
});


var User = function (data) {
    this.data = data;
}

// Authenticate a user if trying to log in
User.authenticate = function(username, password, callback) {
  var authenticateUser = function(err, user){
      /*
      if (err || user === null || password !== user.password) {
          res.redirect("/admin/?error=invalid username or password");
      } else {
          req.session.username = username;
          res.redirect("/admin/notes");
      }
      */
      if (err) return callback(err);
      callback(null, new User(user));
  }

  usersCollection.findOne({username: username}, authenticateUser);
}


module.exports = User;
