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


//startTimer();

function startTimer() {
	var interval = setInterval(function() {
	    $('.circle_animation').css('stroke-dashoffset', (i*(440/time)));
	    var minutes = Math.floor((time - i) % 3600 / 60);
	    var seconds = Math.floor((time - i) % 3600 % 60);
	    if(minutes != 0){
	    	$('h4').text(minutes + "m " + seconds + "s" );
	    }
	    else {
	    	$('h4').text(seconds + "s" );
	    }
	    if (i == time) {
	        clearInterval(interval);
	    }
	    i++;  
	}, 1000);
}