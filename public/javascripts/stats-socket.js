var socket = io.connect('http://127.0.0.1:3000/stats');

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

socket.on('Score', function (data) {
  console.log(data);
});
