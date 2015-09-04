$(function() {

    var escapeText = function(html) {
	var result = String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	if (result === '' + html) return html;
	else return result;
    };

    var convertNote = function(n) {
	var content = escapeText(n.content);
	var links = content.split('[');
	var i, s, rightOffset, spaceOffset, url, label, remainder;
	
	for (i=0; i<links.length; i++) {
	    s = links[i];
	    rightOffset = s.indexOf(']');
	    spaceOffset = s.indexOf(' ');
	    if (rightOffset != -1) {
		if (spaceOffset === -1) {
		    url = s.slice(0, rightOffset);
		    label = url;
		} else {
		    url = s.slice(0,spaceOffset);
		    label = s.slice(spaceOffset + 1, rightOffset);
		}
		remainder = s.slice(rightOffset + 1, s.length);
		links[i] = '<a href="' + url + '" class="mylink">' +
		    label + '</a>' + remainder;
	    }
	}
    
	return {title: escapeText(n.title),
		content: links.join('')};
    }

    var insertNotesIntoDOM = function(userNotes) {
        var i, theNote;

        $(".notes").remove();

	if (userNotes.length < 1) {
	    $("#notesList").append('<div class="notes">No notes!</div>');
	    return;
	}

        for (i=0; i < userNotes.length; i++) {
            console.log("Adding note " + i);
	    theNote = convertNote(userNotes[i]);
            $("#notesList").append('<div class="notes list-group-item list-group-item-default"> ' +
				   '<a href="#" ' + 
				   'class="notes list-group-item-heading" ' +
				   'id="edit' + i + '">' +
                                   '<h4>' + theNote.title + '</h4></a> ' +
                                   '<p class="list-group-item-text">' + 
				   theNote.content + '</p>' +
                                   '</div>');
            $("#edit" + i).click(userNotes[i], editNote);
        }
    }

    var getAndListNotes = function() {
        $.getJSON("/getNotes", insertNotesIntoDOM);
    }

    var updateNoteOnServer = function(event) {
        var theNote = event.data;
        theNote.title = $("#noteTitle").val();
        theNote.content = $("#noteContent").val();
        noteListing();
        $.post("/updateNote",
               {"id": theNote._id,
                "title": theNote.title,
                "content": theNote.content},
               getAndListNotes);
    }

    var deleteNote = function(event) {
	var theNote = event.data;
	if (window.confirm('Delete Note "' + theNote.title +
			   '"?')) {
	    $.post("/deleteNote",
		   {"id": theNote._id},
		  noteListing);
	}
    }

    var editNote = function(event) {
        var theNote = event.data;

        $(".notesArea").replaceWith('<div class="notesArea" ' +
                                    'id="editNoteDiv"></div>');
        $("#editNoteDiv").append('<h2>Edit Note</h2>');

        $("#editNoteDiv").append('<div><input type="text" ' +
                                 'id="noteTitle"></input></div>');
        $("#noteTitle").val(theNote.title);
        $("#editNoteDiv").append('<div>' +
				 '<textarea cols="40" rows="5" ' +
                                 'id="noteContent" wrap="virtual">' +
                                 '</textarea></div>');
        $("#noteContent").val(theNote.content);


        $("#editNoteDiv").append('<button type="button" ' + 
				 'class="btn btn-success" ' +
				 'id="updateNote">' +
                                 'Update</button>')
        $("#updateNote").click(theNote, updateNoteOnServer);

        $("#editNoteDiv").append('<button type="button" ' +
				 'class="btn btn-default" ' +
				 'id="cancelUpdate">' +
                                 'Cancel</button>')
        $("#cancelUpdate").click(noteListing);

        $("#editNoteDiv").append('<button type="button" ' +
				 'class="btn btn-danger" ' +
				 'id="delete">' +
                                 'Delete</button>')
        $("#delete").click(theNote, deleteNote);

    }
    
    var editNewNote = function(result) {
        var theNote = {"title": "",
                       "content": ""};

        if (result.indexOf("ERROR") === -1) {
            theNote._id = result;
            editNote({data: theNote});  //faking event object
        } else {
            // report that we couldn't create a note        
            noteListing();
        }
    }

    var newNote = function() {
        $.post("/newNote", editNewNote);
    }

    var checkChangeUsername = function(result) {
    	var successPrefix = "username changed to ";
    	var username;
    	
            if (result.indexOf("ERROR") === 0) {
    	    console.log(result);
    	} else {
    	    if (result.indexOf(successPrefix) === 0) {
    		username = result.slice(successPrefix.length, result.length);
    		$("#pageTitle").text(username + "'s Account");
    		$("#pageWelcome").text("Welcome " + username);
    	    } else {
    		console.log("ERROR: malformed response from /changeusername");
    	    }
    	}
    	noteListing();
    }

    var doChangeUsername = function() {
	var newUsername = $("#username").val();

	console.log("Change username to " + newUsername);
	$.post("/changeusername", {username: newUsername}, checkChangeUsername);
	noteListing();
    }
    
    var changeUsername = function(event) {
	$(".notesArea").replaceWith('<div class="notesArea" ' +
                                    'id="changeUsernameDiv"></div>');
        $("#changeUsernameDiv").append('<h2>Change Username</h2>');

        $("#changeUsernameDiv").append('<div><input type="text" ' +
                                 'id="username"></input></div>');

        $("#changeUsernameDiv").append('<button type="button" ' +
				       'class="btn btn-danger"' +
				       'id="doChangeUsername">' +
                                       'Change Username</button>')
        $("#doChangeUsername").click(doChangeUsername);

        $("#changeUsernameDiv").append('<button type="button"' +
				       'class="btn btn-default"' +
				       ' id="cancelUsernameChange"> ' +
                                       'Cancel</button>')
        $("#cancelUsernameChange").click(noteListing);

    }

    var noteListing = function() {
        $(".notesArea").replaceWith('<div class="notesArea" ' +
                                    'id="listNotesDiv"></div>');

        $("#listNotesDiv").append('<h2>Notes</h2>');
        $("#listNotesDiv").append('<div id="notesList" class="list-group well">' +
                                  '<a class="notes list-group-item">Loading Notes...</a>' +
                                  '</div>');

        $("#listNotesDiv").append('<button id="newNote"' +
				  ' class="btn btn-primary"' +
				  ' type="button">' +
                                  'New Note</button>');
        $("#newNote").click(newNote);

        $("#listNotesDiv").append('<button id="refreshNotes"' +
				  ' class="btn btn-success"' +
				  ' type="button">' +
                                  'Refresh</button>');
        $("#refreshNotes").click(getAndListNotes);

        $("#listNotesDiv").append('<button id="changeusername"' + 
				  ' class="btn btn-warning"' +
				  'type="button">' +
                                  'Change Username</button>');
        $("#changeusername").click(changeUsername);

        getAndListNotes();
    }

    noteListing();
});
