/**
 * frontend-socket.js
 * ----------------------------------
 * Handles frontend socketio logic
 * Sends and receives events from server
 * @javascripts
 */

var socket = io.connect('http://45.55.90.100:3000/dashboard');
var poloCalled = false;
var gameOver = false;
//var socket = io.connect('http://127.0.0.1:3000/dashboard');

socket.on('dashboardPacket', function (data) {
  console.log(data);
  updatePlace("first", data.firstChar, data.firstPoints, data.firstButtons);
  updatePlace("second", data.secondChar, data.secondPoints, data.secondButtons);
  updatePlace("third", data.thirdChar, data.thirdPoints, data.thirdButtons);
  updatePlace("fourth", data.fourthChar, data.fourthPoints, data.fourthButtons);

  updateInfo(data.numItems, data.numTraps);
  if(gameOver == false){
    i++;
  }
});

socket.on('connected', function (data) {
  console.log(data);
  socket.emit('beep');
});


socket.on('gameStart', function (data) {
  gameOver = false;
});

socket.on('polo', function (data) {
  if(!poloCalled){
    poloCalled = true;
    stopMarco();
    time = 480;
    i = 1;
    resetTimer();
    startTimer();
    console.log("Polo received");
  }
});

socket.on('endGame', function (data) {
  gameOver = true;
  console.log("Unity said goobye");
  callMarco();
  poloCalled = false;
});

$( document ).ready(function() {
  callMarco();
  loadTimer();
});

var marcoInterval;
function callMarco() {
	marcoInterval = setInterval(function() {
    //socket.emit('marco');
	}, 1000);
}

function stopMarco() {
  clearInterval(marcoInterval);
}


function updatePlace(place, name, points, items) {
  $('#' + place + " .name").html(name);

  var src = '/img/mobilia/' + name.toLowerCase() + '-head.png';
  $('#' + place + " img").attr("src", src);
  $('#' + place + " .points").html(points);
  $('#' + place + " .items").html(items);
}

function updateInfo(items, traps) {
  $('#items-collected').html(items);
  $('#traps-placed').html(traps);
}

var time = 480;
var initialOffset = '0';
var i = 1;

function loadTimer() {
	$('.circle_animation').css('stroke-dashoffset', (1*(440/time)));
}


var timerInterval;
function startTimer() {
	timerInterval = setInterval(function() {
	    $('.circle_animation').css('stroke-dashoffset', (i*(440/time)));
	    var minutes = Math.floor((time - i) % 3600 / 60);
	    var seconds = Math.floor((time - i) % 3600 % 60);
      if (seconds < 10){
        seconds = "0" + seconds;
      }
	    if(minutes != 0){
	    	$('.time h2').text(minutes + ":" + seconds + "" );
	    }
	    else {
	    	$('.time h2').text(seconds + ".0s" );
	    }
	    if (i == time) {
	        clearInterval(interval);
	    }
	}, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
	$('.circle_animation').css('stroke-dashoffset', (1*(440/time)));
}
