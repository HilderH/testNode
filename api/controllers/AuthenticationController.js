/**
 * AuthenticationController
 *
 * @description :: Server-side logic for managing Authentications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools"),
	passport = require("passport");

module.exports = {
	logout : function(req,res,next){
		req.session.destroy(function(){
			res.redirect("/");
		});
	},
	login : function(req,res,next){
		if(req.isSocket){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				validateData(data);
			}catch(error){
				console.log("AuthenticationController > login > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}

			function validateData(data){
				try{
					var fields = [{
						id : data.front.email.id,
						value : data.front.email.value,
						required : true,
						minLength : 1,
						maxLength : 100,
						string : true
					},{
						id : data.front.password.id,
						value : data.front.password.value,
						required : true,
						minLength : 1,
						maxLength : 100,
						string : true
					}];
					tools.validateData({fields:fields},function(error){
						if(!error){
							searchUser(data);
						}else{
							res.json({error:error.error,fieldId:error.fieldId,content:error.content});
						}
					});
				}catch(error){
					console.log("AuthenticationController > login > 1: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function searchUser(data){
				try{
					data.front.password.value = tools.encryptCrypto("bloxie",data.front.password.value);
					User.find({email:data.front.email.value,password:data.front.password.value}).exec(function(error,users){
						if(!error){
							if(users.length > 0){
								data.back.user = users[0];
								login(data);
							}else{
								User.find({userName:data.front.email.value,password:data.front.password.value}).exec(function(error,users){
									if(!error){
										if(users.length > 0){
											data.back.user = users[0];
											login(data);
										}else{
											res.json({error:true,content:["Datos incorrectos"]});
										}
									}
								});
							}
						}
					});
				}catch(error){
					console.log("AuthenticationController > login > 2: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function login(data){
				try{
					req.session.settings = {};
					req.session.authenticated = true;
					req.session.userId = data.back.user.id;
					req.session.save(function(error){
						if(!error){
								res.json({error:false,cleanFields:true,content:["Sesión iniciada con éxito"],view:"/Dashboard"});

						}
					});

				}catch(error){
					console.log("AuthenticationController > login > 3: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

		}
	}
};
