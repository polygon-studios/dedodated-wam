var big_image;
$().ready(function(){
    responsive = $(window).width();

    $(window).on('scroll', gsdk.checkScrollForTransparentNavbar);

    if (responsive >= 768){
        big_image = $('.parallax-image').find('img');

        $(window).on('scroll',function(){
            parallax();
        });
    }

});

var parallax = function() {
    var current_scroll = $(this).scrollTop();

    oVal = ($(window).scrollTop() / 3);
    big_image.css('top',oVal);
};
