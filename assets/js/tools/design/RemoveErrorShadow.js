$(document).on("ready",function(){
	$(document).on("click",".CT,.TA,.S,.SL,.D,.checkboxContainer",function(event){
		$(this).removeClass("shadowInError");
	});
});