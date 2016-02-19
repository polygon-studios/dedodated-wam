// Connect to prod mobilia namespace
var socket = io.connect('http://45.55.90.100:3000/mobilia');

// Uncomment for local
//var socket = io.connect('http://127.0.0.1:4000/mobilia');

// Successfull connect handler
socket.on('connected', function (data) {
  console.log(data);
  socket.emit('beep');
});

// Receives location of trap placed by another user
socket.on('userTrap', function (data) {
  console.log(data);
});

// Position handler
socket.on('playerPositions', function (data) {
  moveFox(data.foxX, data.foxY);
  moveSkunk(data.skunkX, data.skunkY);
});

socket.on('unity', function (data) {
  console.log('Unity');
});


// Places a trap
function placeTrap(posX, posY, trapType) {
  socket.emit('trap-Place', { 'trap' : "bramble",
                              'pos-x': posX,
                              'pos-y': posY});
};
