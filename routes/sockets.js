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

     stats = io.of('/stats')
     stats.on('connection', function(socket){
         stats.emit('Score', { hello: 'My Kajigger' });
     })

     io.on('connection', function(socket){
         socket.emit('news', { hello: 'DACEHPTYV' });
     })

     io.on('open', function(socket){
         socket.emit('success', { hello: 'World' });
     })

     io.on('getPositions', function(socket){
         socket.emit('Position', { fox: 'xereee' });
     })

     return io
 }
