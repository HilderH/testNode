function confirmWindow(data,cb){
	$(".confirmWindow .question").text(data.question);
	$(".confirmWindow .confirmButton").text(data.confirm);
	$(".confirmWindow .cancelButton").text(data.cancel);
	$(".backScreen#forConfirmWindow").css({
		display : "block"
	});
	$(".confirmWindow").css({
		display : "block"
	});
	
	$(document).on("click",".confirmWindow .confirmButton",function(event){
		closeConfirmWindow();
		cb(false);
	});
	$(document).on("click",".confirmWindow .cancelButton",function(event){
		closeConfirmWindow()
		cb(true);
	});
	$(document).on("click",".backScreen#forConfirmWindow",function(event){
		closeConfirmWindow();
		cb(true);
	});
}

function closeConfirmWindow(){
	$(document).off("click",".confirmWindow .confirmButton");
	$(document).off("click",".confirmWindow .cancelButton");
	$(document).off("click",".backScreen#forConfirmWindow");
	$(".backScreen#forConfirmWindow").css({
		display : "none"
	});
	$(".confirmWindow").css({
		display : "none"
	});
}