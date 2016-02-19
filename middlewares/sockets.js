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
        mobilia.emit('connected', { hello: 'Mobilia' });

        socket.on('beep', function(){
           mobilia.emit('boop');
           unity.emit('boop');
        });

        socket.on('trap-Place', function (data) {
          unity.emit('trapPlace', data);
        });
     })


     // Unity 'room'
     unity = io.of('/');
     unity.on('connection', function(socket){
        unity.emit('news', { hello: 'Unity' });
       	socket.on('beep', function(){
       		unity.emit('boop');
          mobilia.emit('unity');
       	});
        socket.on('getPositions', function(){
            unity.emit('Position', { fox: 'xereee' });
            mobilia.emit('Position', { fox: 'xereee' });
        })
        socket.on('playerPositions', function (data) {
          mobilia.emit('playerPositions', data);
        });
        
     })

     unity.on('disconnect', function(socket){
        mobilia.emit('gameEnd', { goodbye: 'From Unity' });
     })

     return io
 }
