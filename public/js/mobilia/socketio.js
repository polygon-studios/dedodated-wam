// Connect to prod mobilia namespace
var socket = io.connect('http://45.55.90.100:3000/mobilia');

// Uncomment for local
//var socket = io.connect('http://127.0.0.1:3000/mobilia');

// Successfull connect handler
socket.on('connected', function (data) {
  console.log(data);
  socket.emit('beep');
});

// Receives location of trap placed by another user
socket.on('userTrap', function (data) {
  placeOtherTrap(data.ID);
});

// Receives location of trap deleted in the main unity game
socket.on('deleteTrap', function (data) {
  removeTrap(data.ID);
});

// Position handler
socket.on('playerPositions', function (data) {
  moveFox(data.foxX, data.foxY);
  moveSkunk(data.skunkX, data.skunkY);
  moveBear(data.bearX, data.bearY);
  moveRabbit(data.rabbitX, data.rabbitY);
});


// Places a trap
function placeTrap(posX, posY, trapType, trapID) {
  socket.emit('trap-Place', { 'trap' : trapType,
                              'pos-x': posX,
                              'pos-y': posY,
                              'ID' : trapID});
  console.log('Trap ' + trapID + ' placed');
  timeDown();
};
