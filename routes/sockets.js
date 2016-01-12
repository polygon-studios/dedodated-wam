/**
 * sockets.js
 * ----------------------------------
 * Handles socketio logic
 * Provides the middleman funcitonality
 * @router
 */

 var socketio = require('socket.io')

 module.exports.listen = function(app){
     io = socketio.listen(app)

     users = io.of('/users')
     users.on('connection', function(socket){
         socket.emit('news', { hello: 'DACEHPTYV' });
     })

     io.on('connection', function(socket){
         socket.emit('news', { hello: 'DACEHPTYV' });
     })

     return io
 }
