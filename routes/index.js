var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mc = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var debug = require('debug')('worker');

var notesCollection;

var connectToDBs = function(callback) {
    mc.connect('mongodb://localhost/persistent-notes', function(err, db) {
        if (err) {
            throw err;
        }
        
        notesCollection = db.collection('notes');

        if (callback) {
            callback();
        }
    });
}

// connect to DB when file is loaded
connectToDBs();

/* 

    GET METHODS

*/

// Gets the index page 
router.get('/', function(req, res) {
    if (req.session.username) {
        res.redirect("/notes");
    } else {
        res.render('index', { title: 'COMP 2406 AJAX Notes Demo', 
                              error: req.query.error });
    }
});

// Gets the notes.jade page
router.get('/notes', function(req, res) {
    var username = req.session.username;

    if (username) {
        res.render("notes.jade", {username: username,
                                  title: username +"'s Notes"});
    } else {
        res.redirect("/?error=Not Logged In");
    }
});


/* 

    POST METHODS

*/

// Logs in the user
router.post('/login', function(req, res) {
    var username = req.body.username;
    req.session.username = username;

    res.redirect("/notes")
});

router.post('/logout', function(req, res) {
    req.session.destroy(function(err){
        if (err) {
            console.log("Error: %s", err);
        }
    });
    res.redirect("/");
});

// Fetches all the notes from the server
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

// Updates the current note
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

    var escapeText = function(html) {
        var result = String(html)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
        if (result === '' + html) return html;
        else return result;
    };

    var makeLink = function(html) {
        var start = html.indexOf("[ ");
        var end = html.lastIndexOf(" ]") + 2;
        var tag = html.substring(start, end);
        debug(tag);

        var URLstart = tag.indexOf("http");
        var URLend = tag.indexOf(".com") + 3;
        var URL = tag.substr(URLstart, URLend);
        debug(URL);

        var labelStart = tag.indexOf(".com") + 5;
        var labelEnd = tag.lastIndexOf(" ]");
        var label = tag.substring(labelStart, labelEnd);
        debug(label);

        var firstPart = html.split("[ ", 1);
        var secondPart = html.split(" ]");
        secondPart = secondPart[1];
        debug(firstPart);
        debug(secondPart);

        var finalHTML = firstPart + "<a href=" + URL + ">" + label + "</a>" + secondPart;
        
        return finalHTML;
    }

    content = escapeText(content);
    debug(content)
    content = makeLink(content);
    debug(content)
    
    if (username) {
        if (id && title && content) {
            // should get note and check 
            // if it really belongs to the current user
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


// Deletes the note
router.post('/deleteNote', function(req, res) {
    var username = req.session.username;
    var id = ObjectID(req.body.id);
    var noteTitle = req.body.title;
    

    var checkDelete = function(err, result) {
        if (err) {
            res.send("ERROR: Delete failed");
        } else {
            res.send("Delete succeeded");
        }
    }
    
    if (username) {
        notesCollection.remove({_id: id}, checkDelete);
    } else {
        res.redirect("/?error=Not Logged In");
    }
});

// Adds a new note
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


// Change the username
router.post('/changeusername', function(req, res) {
    var username = req.session.username;
    var newUsername = req.body.username;

    var checkUpdate = function(err, result) {
        if (err) {
            res.send("ERROR: Update failed");
        } else {
            req.session.username = newUsername;
            res.send("Update succeeded");
        }
    }

    if (username) {
        notesCollection.count({owner: newUsername}, function(err, results) {
            if(err) {
                res.send("ERROR: Update failed");
            }
            else {
                if(results!=0)    {
                    res.send("username already taken");
                }
                else {
                    debug("Updating");
                    notesCollection.update(
                        {owner: username },
                        {$set: { owner: newUsername } },
                        {multi: true},
                        checkUpdate);
                }
            }
       });   

    } else {
        res.redirect("/?error=Not Logged In");
    }
});


module.exports = router;
