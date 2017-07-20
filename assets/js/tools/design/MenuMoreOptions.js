$(document).on("ready",function(){
	$(document).on("click",".showMenuMoreOptions",function(e){
		var selectorMenu = "."+$(this).attr("id");
		if($(selectorMenu).attr("way") == "left"){
			$(selectorMenu).css({marginLeft:"-"+($(selectorMenu).css("width").replace("px","")*1-16)+"px"});
			$(selectorMenu).css("margin-top","10px");
		}else if($(selectorMenu).attr("way") == "right"){
			$(selectorMenu).css({marginLeft:"-20px"});
		}
		$(selectorMenu).addClass("fadeInFromTop");
	});

	$(document).on("click","html",function(event){
		if(!$(event.target).closest(".showMenuMoreOptions").length || $(event.target).closest(".menuMoreOptions").length){
			$(".menuMoreOptions").removeClass("fadeInFromTop");
		}
		
	});
});