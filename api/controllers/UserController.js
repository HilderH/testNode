/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools");
var ip='http://localhost:1337';

module.exports = {
	register_teacher_new: function (req, res, next) {
		if(req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			validateUsername(data);
			function validateUsername(data){
				try{
					User.find({username: data.front.username.value}).exec(function(error, user){
						if (!error && user.length>0) {
							res.json({
								error: true,
								content: ['El username no esta disponible']
							});
						}
						else{
							validateEmail(data);
						}
					});
				}catch(error){
					console.log("Error UserController -> register_teacher -> 1: "+error);
				}
			}
			function validateEmail(data){
				try{
					User.find({email: data.front.email.value}).exec(function(error, user){
						if (!error && user.length>0) {
							res.json({
								error: true,
								content: ['El email ya esta registrado']
							});
						}
						else{
							 data.back.dataToCreate={
							 	name: data.front.name.value,
							 	lastname: data.front.lastname.value,
							 	username: data.front.username.value,
							 	email: data.front.email.value,
							 	password: tools.encryptCrypto('bloxie', data.front.password.value),
							 	teacher: true,
							 };
							 User.create(data.back.dataToCreate).exec(function(error, user){
							 	if(!error){
							 		req.session.settings = {};
									req.session.authenticated = true;
									req.session.userId = user.id;
									req.session.save(function(error){
										if(!error){
											if(user.teacher || user.student){
												res.json({
													error: false,
													content: ['!'+user.name+', tu registro ha sido exitoso!'],
													view: '/Register/Teacher/Profile'
												});
											}else{
												res.json({
													error: false,
													content: ['¡Registro exitoso!, pero no tienes permisos'],
													view: '/'
												});
											}
										}
									});
			 						
							 	}
							 	else{
			 						res.json({
										error: true,
										content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
									});
					
							 	}
							 });
						}
					});	
				}catch(error){
					console.log("Error UserController -> register_teacher -> 2: "+error);
				}
			}
		}
	},
	register_student_new: function (req, res, next) {
		if(req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			validateUsername(data);
			function validateUsername(data){
				try{
					User.find({username: data.front.username.value}).exec(function(error, user){
						if (!error && user.length>0) {
							res.json({
								error: true,
								content: ['El username no esta disponible']
							});
						}
						else{
							validateEmail(data);
						}
					});
				}catch(error){
					console.log("Error UserController -> register_student -> 1: "+error);
				}
			}
			function validateEmail(data){
				try{
					User.find({email: data.front.email.value}).exec(function(error, user){
						if (!error && user.length>0) {
							res.json({
								error: true,
								content: ['El email ya esta registrado']
							});
						}
						else{
							 data.back.dataToCreate={
							 	name: data.front.name.value,
							 	lastname: data.front.lastname.value,
							 	username: data.front.username.value,
							 	email: data.front.email.value,
							 	password: tools.encryptCrypto('bloxie', data.front.password.value),
							 	student: true,
							 	coins: 0,
							 };
							 User.create(data.back.dataToCreate).exec(function(error, user){
							 	if(!error){
							 		req.session.settings = {};
									req.session.authenticated = true;
									req.session.userId = user.id;
									req.session.save(function(error){
										if(!error){
											if(user.teacher || user.student){
												res.json({
													error: false,
													content: ['¡Registro exitoso!'],
													view: '/Register/Student/Categories'
												});
											}else{
												res.json({
													error: false,
													content: ['¡Registro exitoso!, pero no tienes permisos'],
													view: '/'
												});
											}
										}
									});
			 						
							 	}
							 	else{
			 						res.json({
										error: true,
										content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
									});
					
							 	}
							});
						}
					});	
				}catch(error){
					console.log("Error UserController -> register_teacher -> 2: "+error);
				}
			}
		}
	},
	find_categories: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
		//if(req.isSocket){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						Category.find({status: true}).exec(function(error, categories){
							if(!error){
								data.back.categories=categories;
								res.json({
									error: false,
									elements: data.back.categories
								});
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});
							}
						});
					}
					else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}catch(error){
				console.log("Error UserController -> find_categories -> 1: "+error);	
			}
		}
	},
	find_typeTeacher: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
		//if(req.isSocket){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						TypeTeacher.find({status: true}).exec(function(error, types){
							if(!error){
								data.back.type=types;
								res.json({
									error: false,
									elements: data.back.type
								});
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});
							}
						});
					}
					else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}catch(error){
				console.log("Error UserController -> find_categories -> 1: "+error);	
			}
		}
	},
	save_wizard_teacher: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						User.update({id: data.back.user.id}, {type_teacher: data.front.type}).exec(function afterwards(error, user){
							if (!error) {
								ciclo(0);
							}
							else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});			
							}
						});
					}
				});
				function ciclo(i){
					if(data.front.categories[i]){
						CategoryTeacher.create({teacher: data.back.user.id, category: data.front.categories[i].id, status: true}).exec(function(error, category){
							if (!error) {
								ciclo(i+1);
							}
						});
					}else{
						res.json({
							error: false,
							content: ["¡Ahora solo falta que llenes tu perfil para que conozcan mas de ti!"]
						});
					}
				}
			}catch(error){
				console.log("Error UserController -> save_wizard_teacher -> 1: "+error);	
			}
		}
	},
	save_category_student: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						ciclo(0);
					}
				});
				function ciclo(i){
					if(data.front.categories[i]){
						CategoryStudent.create({student: data.back.user.id, category: data.front.categories[i].id, status: true}).exec(function(error, category){
							if (!error) {
								ciclo(i+1);
							}
						});
					}else{
						res.json({
							error: false,
							content: ["¡Ahora solo falta que llenes tu perfil para que conozcan mas de ti!"]
						});
					}
				}
			}catch(error){
				console.log("Error UserController -> save_wizard_teacher -> 1: "+error);	
			}
		}
	},
	register_data_profile_teacher: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						data.back.dataToUpdate={
							name: data.front.name.value,
							lastname: data.front.lastname.value,
							phone: data.front.phone.value,
							birthdate: data.front.birthdate.value,
							rif: data.front.rif.value,
							cedula: data.front.cedula.value,
							comentary: data.front.comentary.value
						};
						data.back.photo=data.front.photo[0];
						uploadimage();
						function uploadimage(){
							try{
								cicle1(0);
								function cicle1(i){
									data.back.photo.name = "/images/users/"+tools.generateRandomCode(50)+"."+data.back.photo.value.substring(data.back.photo.value.indexOf("/")+1,data.back.photo.value.indexOf(";"));
									tools.existFile({name:data.back.photo.name},function(exist){
										if(!exist){
											tools.uploadFile({name:data.back.photo.name,value:data.back.photo.value.split(",")[1]},function(error){
												if(!error){
													data.back.dataToUpdate.photo = data.back.photo.name;
													end(i);
												}else{
													res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
												}
											});
										}else{
											cicle1(i);
										}
									});
								}		//}
								function end(j){
									j++;
									if(data.back.photo[j]){
										cicle1(j);
									}else{
										User.update({id: data.back.user.id},data.back.dataToUpdate).exec(function afterwards(error, user){
											if(!error){
												res.json({
													error: false,
													content: ['Se ha guardado sus datos']
												});
											}else{
												res.json({
													error: true,
													content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
												});
											}
										});
									}
								}
							}
							catch(error){
								console.log("PrivateViewsController > registerProfileClienteNew > 3: "+error);
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						}
						
						
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
						
					}
				});
				
			}catch(error){
				console.log("Error UserController -> save_wizard_teacher -> 1: "+error);	
			}
		}	
	},
	register_data_profile_student: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						data.back.dataToUpdate={
							name: data.front.name.value,
							lastname: data.front.lastname.value,
							phone: data.front.phone.value,
							birthdate: data.front.birthdate.value,
							rif: data.front.rif.value,
							cedula: data.front.cedula.value,
							comentary: data.front.comentary.value
						};
						data.back.photo=data.front.photo[0];
						uploadimage();
						function uploadimage(){
							try{
								cicle1(0);
								function cicle1(i){
									data.back.photo.name = "/images/users/"+tools.generateRandomCode(50)+"."+data.back.photo.value.substring(data.back.photo.value.indexOf("/")+1,data.back.photo.value.indexOf(";"));
									tools.existFile({name:data.back.photo.name},function(exist){
										if(!exist){
											tools.uploadFile({name:data.back.photo.name,value:data.back.photo.value.split(",")[1]},function(error){
												if(!error){
													data.back.dataToUpdate.photo = data.back.photo.name;
													end(i);
												}else{
													res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
												}
											});
										}else{
											cicle1(i);
										}
									});
								}		//}
								function end(j){
									j++;
									if(data.back.photo[j]){
										cicle1(j);
									}else{
										User.update({id: data.back.user.id},data.back.dataToUpdate).exec(function afterwards(error, user){
											if(!error){
												res.json({
													error: false,
													content: ['Se ha guardado sus datos']
												});
											}else{
												res.json({
													error: true,
													content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
												});
											}
										});
									}
								}
							}
							catch(error){
								console.log("PrivateViewsController > registerProfileClienteNew > 3: "+error);
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						}
						
						
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
						
					}
				});
				
			}catch(error){
				console.log("Error UserController -> save_wizard_teacher -> 1: "+error);	
			}
		}	
	},
	find_teachers: function(req, res, next){
		if(req.isSocket){
			try{
				var data={
					front: req.params.all(),
					back:{},
					session: {}
				};
				User.find({teacher:true}).populate("categories_teacher").exec(function(error, teacher){
					if (!error) {
						data.back.teacher=teacher;
						get_populates(0);
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});	
					}
				});
				function get_populates(index){
					if(typeof data.back.teacher[index] != "undefined"){
						CategoryTeacher.find({teacher: data.back.teacher[index].id, status: true}).populate("category").exec(function(error, categories){
							if (!error && categories) {
								data.back.teacher[index].categories_teacher=categories;
								get_populates(index+1);
							}
						})
					}else{
						if(data.back.teacher[index+1]){
							get_populates(index+1);
						}else{
							res.json({
								error: false,
								elements: data.back.teacher
							});
						}
					}
				}
			}catch(error){
				console.log("Error UserController -> find_teacher -> 1: "+error);	
			}
		}

	},
	find_categories_by_user: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back:{},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user){
					if (!error && user) {
						data.back.user=user;
						data.session = user;
						data.session.settings = req.session.settings;		
						if (data.back.user.student) {
							get_categories_student(data);
						}else if(data.back.user.teacher){
							console.log("cate2");
							get_categories_teacher(data);
						}else{
							console.log("else");
						}
					}else{
						console.log("des");
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});			
					}
				});
				function get_categories_student(data){
					try{
						CategoryStudent.find({student: data.back.user.id}).populate("category").exec(function(error, categories){
							if (!error) {
								res.json({
									error: false,
									elements: categories
								});
							}
						});
					}catch(error){
						console.log("Error UserController--> find_categories_by_user 2 "+error);
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				}
				function get_categories_teacher(data){
					try{
						console.log("11");
						CategoryTeacher.find({teacher: data.back.user.id}).populate("category").exec(function(error, categories){
							if (!error) {
								console.log("cat");
								res.json({
									error: false,
									elements: categories
								});
							}
						});
					}catch(error){
						console.log("Error UserController--> find_categories_by_user 2 "+error);
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				}
			}catch(error){
				console.log("Error UserController--> find_categories_by_user 1 "+error);
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}else{
			console.log("ahu ");
		}
	},
	passwordChange : function(req,res,next){
		if(req.isSocket){
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
						validateData(data);
					}else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
				});
			}catch(error){
				console.log("UsersController > passwordChange > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}

			function validateData(data){
				try{
					var fields = [{
						id : data.front.actualPassword.id,
						value : data.front.actualPassword.value,
						required : true,
						minLength : 1,
						maxLength : 100,
						string : true
					},{
						id : data.front.newPassword.id,
						value : data.front.newPassword.value,
						required : true,
						minLength : 1,
						maxLength : 100,
						string : true
					},{
						id : data.front.newPasswordRepeat.id,
						value : data.front.newPasswordRepeat.value,
						required : true,
						minLength : 1,
						maxLength : 100,
						string : true
					}];			
					tools.validateData({fields:fields},function(error){
						if(!error){
							validatePassword(data);
						}else{
							res.json({error:error.error,fieldId:error.fieldId,content:error.content});
						}
					});
				}catch(error){
					console.log("UsersController > passwordChange > 1: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function validatePassword(data){
				try{
					if(data.front.newPassword.value == data.front.newPasswordRepeat.value){
						if(tools.encryptCrypto("bloxie",data.front.actualPassword.value) == data.session.password){
							updateData(data);
						}else{
							res.json({
								error : true,
								content : ["La contraseña actual no coincide"]
							});
						}
					}else{
						res.json({
							error : true,
							content : ["Las contraseñas no coinciden"]
						});
					}
				}catch(error){
					console.log("UsersController > passwordChange > 2: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function updateData(data){
				try{
					data.session.password = tools.encryptCrypto("bloxie",data.front.newPassword.value);
					var f = new Date();
					var email={
						from: 'Bloxie',
						to: data.session.email,
						name: '.',
						body: 'Bloxie te informa que se ha cambiado tu contraseña el dia '+f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()+" a las "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+' <br> ',
						title: 'Cambio de Contraseña',
						subject: 'Cambio de Contraseña',
						href:ip,
						nameButton: 'Ir a Bloxie',
						footer: 'Cordialmente, <br> Equipo Bloxie.'
					}
					data.session.save(function(error){
						if(!error){
							tools.sendEmail(email, function(error){
								if (!error) {
									res.json({
										error : false,
										cleanFields : true,
										content : ["Contraseña modificada con éxito"]
									});
								}
							});
						}
					});
				}catch(error){
					console.log("UsersController > passwordChange > 3: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

		}
	},
	profileUpdate: function(req, res, next){
		if(req.session.authenticated && req.isSocket){
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
						updateProfile(data);
					}
					else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
				});
			}
			catch(error){
				console.log("UsersController > profileUpdate > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}

			function updateProfile(data){
				data.back.profileUpdate={
					phone: data.front.phone.value,
					birthdate: data.front.birthdate.value,
					comentary: data.front.comentary.value,
				};
				data.back.photo={};
				if (data.front.edit) {
					console.log("data.: "+data.front.photo);
					updatePhoto(data);		
				}else{
					updateUser(data);		
				}
			}
			function updatePhoto(data){
				try{
					cicle1(0);
					function cicle1(i){
						data.back.photo.name = "/images/users/"+tools.generateRandomCode(50)+"."+data.front.photo.value.value.substring(data.front.photo.value.value.indexOf("/")+1,data.front.photo.value.value.indexOf(";"));
						tools.existFile({name:data.back.photo.name},function(exist){
							if(!exist){
								tools.uploadFile({name:data.back.photo.name,value:data.front.photo.value.value.split(",")[1]},function(error){
									if(!error){
										data.back.profileUpdate.photo = data.back.photo.name;
										end(i);
									}else{
										res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
									}
								});
							}else{
								cicle1(i);
							}
						});
					}		//}
					function end(j){
						j++;
						if(data.front.photo[j]){
							cicle1(j);
						}else{
							updateUser(data);
						}
					}
				}
				catch(error){
					console.log("CourseController > profileUpdate > 2: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}
			function updateUser(data){
				User.update({id: data.session.id}, data.back.profileUpdate).exec(function(error, user){
					if(!error){
						res.json({
							error : false,
							cleanFields : true,
							content : ["Perfil actualizado con éxito"]
						});		
					}else{
						res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
					}
				});
			}
		}
	},
	setonesignal: function(req, res,next){
		if(req.session.authenticated && req.isSocket){
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
						updateOnesignal(data);
					}
					else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
					function updateOnesignal(){
						User.update({id: data.session.id}, {oneSignalID: data.front.onesignal}).exec(function(error, user){
							if (!error) {
								res.json({
									error: false,
									content: '',
								});
							}
						});
					}
				});
			}
			catch(error){
				console.log("UsersController > profileUpdate > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}	
	}
};