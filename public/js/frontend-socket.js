/**
 * frontend-socket.js
 * ----------------------------------
 * Handles frontend socketio logic
 * Sends and receives events from server
 * @javascripts
 */

var socket = io.connect('http://45.55.90.100:3000/dashboard');

//var socket = io.connect('http://127.0.0.1:3000/dashboard');

socket.on('dashboardPacket', function (data) {
  console.log(data);
  updatePlace("first", data.firstChar, data.firstPoints, data.firstItems);
  updatePlace("second", data.secondChar, data.secondPoints, data.secondItems);
  updatePlace("third", data.thirdChar, data.thirdPoints, data.thirdItems);
  updatePlace("fourth", data.fourthChar, data.fourthPoints, data.fourthItems);

  updateInfo(data.numItems, data.numTraps);
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

function updatePlace(place, name, points, items) {
  $('#' + place + " .name").html(name);
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

$( document ).ready(function() {
    loadTimer();
 });

function loadTimer() {
	$('.circle_animation').css('stroke-dashoffset', (1*(440/time)));
}

function resetTimer() {
	$('.circle_animation').css('stroke-dashoffset', (480*(440/time)));
}


startTimer();

function startTimer() {
	var interval = setInterval(function() {
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
	    i++;
	}, 1000);
}

function resetTimer(){
  $('.circle_animation').css('stroke-dashoffset', 440);
}
