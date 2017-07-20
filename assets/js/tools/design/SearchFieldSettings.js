$(document).on("ready",function(event){
	$(document).on("click",".S",function(event){
		var selector = "#elementsContainer-"+$(this).attr("id");
		$(selector).addClass("fadeInFromTop");
		$(selector).addClass("active");
	});

	$(document).on("click","html",function(event){
		if(!$(event.target).closest(".S").length && !$(event.target).closest(".elementsContainer").length){
			closeSearchElementContainer();
		}
	});
});

function closeSearchElementContainer(){
	$(".elementsContainer.active").removeClass("fadeInFromTop");
	$(".elementsContainer.active").addClass("fadeOutFromTop");
	setTimeout(function(){
		$(".elementsContainer.active").removeClass("fadeOutFromTop");
		$(".elementsContainer.active").removeClass("active");
	},200);
}