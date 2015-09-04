$(function(){
	$("#register").on("click",function(){
		var $form = $("form");
		$form.attr("action", "/register");
		$form.submit();
	});
});
