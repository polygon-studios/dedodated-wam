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
    
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-74427876-1', 'auto');
    ga('send', 'pageview');
});

var parallax = function() {
    var current_scroll = $(this).scrollTop();

    oVal = ($(window).scrollTop() / 3);
    big_image.css('top',oVal);
};

function scrollTo(link) {
  try {
    $('html, body').animate({scrollTop:$(link).position().top - 50 }, 'slow');
  } catch(err){}
}
