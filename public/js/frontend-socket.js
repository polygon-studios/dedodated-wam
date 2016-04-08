/**
 * frontend-socket.js
 * ----------------------------------
 * Handles frontend socketio logic
 * Sends and receives events from server
 * @javascripts
 */

var socket = io.connect('http://45.55.90.100:3000/dashboard');

socket.on('dataPacket', function (data) {
  console.log(data);
  socket.emit('beep');
});

socket.on('connected', function (data) {
  console.log(data);
  socket.emit('beep');
});

socket.on('polo', function (data) {
  console.log(data);
});

$( document ).ready(function() {
  socket.emit('marco');
});
