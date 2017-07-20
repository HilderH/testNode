$(document).on("ready",function(event){
	$(document).on("focus",".D",function(event){
		$(this).blur();
	});

	$(document).on("click",".D",function(event){
		$(".backScreen#forDate").css({
			display : "block"
		});
		var selector = ".calendar-"+$(this).attr("id");
		$(selector).css({
			display : "block"
		}).addClass("active");
	});

	$(document).on("click","html",function(event){
		if(!$(event.target).closest(".D").length && !$(event.target).closest("#calendar").length){
			closeSearchDate();
		}
	});
});

function closeSearchDate(){
	$(".backScreen#forDate").css({
		display : "none"
	});
	$("#calendar.active").css({
		display : "none"
	}).removeClass("active");
}