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
     dashboard = io.of('/dashboard');
     dashboard.on('connection', function(socket){
         dashboard.emit('connected', { hello: 'Dashboard' });

         // Ping Unity to see if a game is active!
         socket.on('marco', function(){
            unity.emit('marco');
         });


     })

     // Mobilia room
     mobilia = io.of('/mobilia');
     mobilia.on('connection', function(socket){
        mobilia.emit('connected', { hello: 'Mobilia' });

        socket.on('beep', function(){
           mobilia.emit('boop');
           unity.emit('boop');
        });

        // Ping Unity to see if a game is active!
        socket.on('marco', function(){
           unity.emit('marco');
        });

        // Ping unity that you've placed a trap
        socket.on('trap-Place', function (data) {
          unity.emit('trapPlace', data);
          mobilia.emit('userTrap', data);
        });
     })


     // Unity 'room'
     unity = io.of('/');
     unity.on('connection', function(socket){
        unity.emit('news', { hello: 'Unity' });
       	socket.on('beep', function(){
       		unity.emit('boop');
       	});

        // Continuous function call to move the characters
        socket.on('playerPositions', function (data) {
          mobilia.emit('playerPositions', data);
        });

        // Passes character over to house project
        socket.on('playerEnter', function (data) {
          unity.emit('playerEnter', data);
        });

        // Passes the nighttime trigger to house
        socket.on('nighttime', function () {
          unity.emit('nighttime');
        });

        // Passes when the button locks the house
        socket.on('redButton', function () {
          unity.emit('redButton');
        });

        // Resets the house to its original state
        socket.on('deleteTrap', function (data) {
          mobilia.emit('removeTrap', data);
        });

        // Resets the house to its original state
        socket.on('dashboardPacket', function (data) {
          dashboard.emit('dashboardPacket', data);
        });

        // Passes in the places of the characters when the game ends
        socket.on('endGame', function (data) {
          unity.emit('endGame', data);
        });

        // Resets the house to its original state
        socket.on('resetHouse', function (data) {
          unity.emit('resetHouse', data);
        });

        // Unity yells polo back to say game is running
        socket.on('polo', function () {
          mobilia.emit('polo');
          dashboard.emit('polo');
        });

     })

     unity.on('disconnect', function(socket){
        dashboard.emit('goodbye');
        mobilia.emit('goodbye');
     })

     return io
 }
