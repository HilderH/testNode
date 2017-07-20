function displayWindow(data,cb){
	$(".backScreen#forWindow").css({
		display : "block",
		zIndex : "14"
	});
	$(".window#"+data.id).css({
		display : "block"
	}).addClass("active");
	
	$(document).on("click",".backScreen#forWindow",function(event){
		closeWindow();
		if(cb){
			cb(true);
		}
	});
}

function closeWindow(){
	$(document).off("click",".backScreen#forWindow");
	$(".backScreen#forWindow").css({
		display : "none"
	});
	$(".window.active").css({
		display : "none"
	}).removeClass("active");
}