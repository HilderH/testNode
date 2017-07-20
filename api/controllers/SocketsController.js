/**
 * SocketsController
 *
 * @description :: Server-side logic for managing Sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	start : function(req,res,next){
		console.log("req.session "+req.session.authenticated);
		if(req.isSocket){
			if(req.session.authenticated){
				try{
					var data = {
						front : req.params.all(),
						back : {},
						session : {}
					};
					tools.validateUser(req.session.userId,function(error,user){
						if(!error && user){
							data.session = user;
							data.session.settings = req.session.settings;
							addSocketToRooms(data);
						}else{
							req.session.destroy(function(){sails.sockets.broadcast(sails.sockets.getId(),"redirect",{direction:"/"});});
						}
					});
				}catch(error){
					console.log("Error SocketsController -> start: "+error);
				}

				function addSocketToRooms(data){
					try{
						sails.sockets.join(req.socket.id,data.session.id);
						if(data.session.teacher){
							sails.sockets.join(req.socket.id,"teachers");
						}else if(data.session.student){
							sails.sockets.join(req.socket.id,"students");
						}
						else if(data.session.admin){
							sails.sockets.join(req.socket.id,"admins");	
						}
						res.ok();
					}catch(error){
						console.log("Error SocketsController -> start: "+error);
					}
				}

			}else{
				console.log("perdio la session en socketcontroller");
				req.session.destroy(function(){sails.sockets.broadcast(sails.sockets.getId(),"redirect",{direction:"/"});});
			}
		}
	}
};