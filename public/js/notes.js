$(function() {
    var insertNotesIntoDOM = function(userNotes) {
        var i, theNote;

        $(".notes").remove();

        if (userNotes.length < 1) {
            $("#notesList").append('<div class="notes">No notes!</div>');
            return;
        }

        for (i=0; i < userNotes.length; i++) {
            console.log("Adding note " + i);
            theNote = userNotes[i];
            $("#notesList").append('<div class="notes list-group-item ' +
				   'list-group-item-default"> ' +
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
    }
    
    var editNewNote = function(result) {
        var theNote = {"title": "",
                       "content": ""};

        if (result.indexOf("ERROR") === -1) {
            theNote._id = result;
            editNote({data: theNote});
        } else {
            noteListing();
        }
    }

    var newNote = function() {
        $.post("/newNote", editNewNote);
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

        getAndListNotes();
    }

    noteListing();
});
