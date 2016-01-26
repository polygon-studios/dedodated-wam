/**
 * sockets.js
 * ----------------------------------
 * Handles socketio logic
 * Provides the middleman funcitonality
 * @router
 */

 var socketio = require('socket.io')({
 	transports: ['websocket', 'polling'],
 });

 module.exports.listen = function(app){
     io = socketio.listen(app)

     // Stats room
     stats = io.of('/stats');
     stats.on('connection', function(socket){
         stats.emit('Score', { hello: 'My Kajigger' });
     })

     // Mobilia room
     mobilia = io.of('/mobilia');
     mobilia.on('connection', function(socket){
        //socket.join('mobilia');
        mobilia.emit('news', { hello: 'Mobilia' });

        socket.on('beep', function(){
         mobilia.emit('boop');
       });
     })


     // Unity 'room'
     io.on('connection', function(socket){
        socket.emit('news', { hello: 'Unity' });
       	socket.on('beep', function(){
       		socket.emit('boop');
          mobilia.emit('unity');
       	});
        io.on('open', function(){
            io.emit('success', { hello: 'World' });
            socket.emit('success', { hello: 'World' });
        })
        io.on('getPositions', function(){
            io.emit('Position', { fox: 'xereee' });
            socket.emit('Position', { fox: 'xereee' });
        })
     })

     io.on('open', function(socket){
         socket.emit('success', { hello: 'World' });
     })

     io.on('getPositions', function(socket){
         socket.emit('Position', { fox: 'xereee' });
     })

     return io
 }
