io.socket.on("redirect",function(data){
	window.location = data.direction;
});