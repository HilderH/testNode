$(document).on("ready",function(event){
	$(document).on("focus",".SL",function(event){
		$(this).blur();
	});
	$(document).on("click",".SL",function(event){
		var selector = "#optionsContainer-"+$(this).attr("id");
		$(selector).addClass("active");
		$(selector).addClass("fadeInFromTop");
	});

	$(document).on("click","html",function(event){
		if(!$(event.target).closest(".SL").length && ($(event.target).closest(".option").length || !$(event.target).closest(".optionsContainer").length)){
			$(".optionsContainer.active").removeClass("fadeInFromTop");
			$(".optionsContainer.active").addClass("fadeOutFromTop");
			setTimeout(function(){
				$(".optionsContainer.active").removeClass("fadeOutFromTop");
				$(".optionsContainer.active").removeClass("active");
			},200);
		}
	});
});