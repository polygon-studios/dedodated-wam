/**
 * frontend-socket.js
 * ----------------------------------
 * Handles frontend socketio logic
 * Sends and receives events from server
 * @javascripts
 */

 var socket = io.connect('http://127.0.0.1:3000');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('beep');
});

socket.on('Position', function (data) {
  console.log(data);
});

socket.on('beep', function (data) {
  console.log('BEEP');
});
