/**
 * PrivateViewsController
 *
 * @description :: Server-side logic for managing private views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools");
var request = require('request');
var rp = require('request-promise');
module.exports = {

	dashboard: function(req, res, next){
		if(!req.isSocket && req.session.authenticated){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("private/index");
		}else if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.back.user = data.session;
						var options = {
						    uri: 'http://api.tvmaze.com/shows',
						    headers: {
						        'User-Agent': 'Request-Promise'
						    },
								resolveWithFullResponse: true,
						    json: true
						};
						var shows;
						rp(options).then(function (repos) {
								if (repos.statusCode == 200) {
									data.back.shows = repos.body
									res.json({
										error: false,
										data: data.back
									});

								}
				    }).catch(function (err) {
				        // API call failed...
				    });
						

					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPublicController -> home: "+error);
			}
			function validateFavorites(data){
				try{
					var findFavorites = function (show,endResult) {
						Favorite.findOne( {where: {id: enrollment.period.teacher}} ).exec(function (error, obj){

							if (obj && !error) {
								console.log(obj)
							}else{
								console.log('No hay nada');
							}

						});
					}
					async.map(data.shows, findFavorites, function iterador(err,results){
							// return res.json({
							// 	error: false,
							// 	elements: results
							// });

					});
				}catch(error){
					req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
				}
			}
		}
	},
	activate_course_view : function(req,res,next){
		if(!req.isSocket){
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
							validateCourseData(data);
						}else{
							req.session.destroy(function(){res.redirect("/");});
						}
					});
				}catch(error){
					res.view(500);
				}

				function validateCourseData(data){
					try{
						Course.find({id:data.front.idCourse}).exec(function(error,courses){
							if(!error && courses.length > 0){
								data.back.courses = courses[0];
								res.view("private/index",{data:{user:data.session}});
							}else{
								res.view(404);
							}
						});
					}catch(error){
						res.view(404);
					}
				}
			}else{
				req.session.destroy(function(){res.redirect("/");});
			}
		}else if(req.isSocket){
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
							data.back.user = data.session;
							validateCourseDataViaSocket(data);
						}else{
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					});
				}catch(error){
					console.log("Error ViewPrivateController -> clientsshipmentsPublishedUpdateShipmentSlug: "+error);
				}

				function validateCourseDataViaSocket(data){
					try{
						Course.find({id:data.front.idCourse}).populate("type").populate("categories").exec(function(error,courses){
							if(!error && courses.length > 0){
								data.back.course = courses[0];
								get_populates();
							}else{
								req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
							}
						});
						function get_populates(){
							CategoryCourse.find({course: data.back.course.id}).populate("category").exec(function(error, categories){
								if (!error && categories) {
									data.back.course.categories=categories;
									res.json(data.back);
								}
							});

						}
					}catch(error){
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				}
			}else{
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}
	},


};
