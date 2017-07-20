/**
 * PrivateViewsController
 *
 * @description :: Server-side logic for managing private views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools");
var request = require('request');
module.exports = {
	teacher_register_profile: function(req, res, next) {
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			if(!req.session.authenticated){
				res.view("public/index");
			}
			else if(req.session.authenticated){
				res.view("private/index");
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
							res.json({user: data.back.user});
						}else{
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					});
				}catch(error){
					console.log("Error ViewPrivateController -> registerProfileClient: "+error);
				}
			}else{
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}
	},
	student_register_categories: function(req, res, next) {
		// body...
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			if(!req.session.authenticated){
				res.view("public/index");
			}
			else if(req.session.authenticated){
				res.view("private/index");
			}
		}else if(req.isSocket){
			if(!req.session.authenticated){
				try{
					var data = {
						front : req.params.all(),
						back : {},
						session : {}
					};
					res.json({user: 'data'});

					tools.validateUser(req.session.userId,function(error,user){
						if(!error && user){
							data.session = user;
							data.session.settings = req.session.settings;
							data.back.user = data.session;
							res.json({user: data.back.user});
						}else{
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					});
				}catch(error){
					console.log("Error ViewPrivateController -> registerProfileClient: "+error);
				}
			}else{
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
							data.back.user = user;
							res.json({user: data.back.user});
						}else{
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					});
				}catch(error){
					console.log("Error ViewPrivateController -> registerProfileClient: "+error);
				}
			//	req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}
	},
	teacher_my_profile: function(req, res, next) {
		// body...
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			if(!req.session.authenticated){
				res.view("public/index");
			}
			else if(req.session.authenticated){
				res.view("private/index");
			}
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
						data.session.settings = req.session.settings;
						data.back.user = user;
						res.json({user: data.back.user});
					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPrivateController -> teacher_my_profile: "+error);
			}
		//	req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
		}

	},
	student_my_profile: function(req, res, next) {
		// body...
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			if(!req.session.authenticated){
				res.view("public/index");
			}
			else if(req.session.authenticated){
				res.view("private/index");
			}
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
						data.session.settings = req.session.settings;
						data.back.user = user;
						res.json({user: data.back.user});
					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPrivateController -> teacher_my_profile: "+error);
			}
		//	req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
		}

	},
	dashboard: function(req, res, next){
		if(!req.isSocket && req.session.authenticated){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("private/index");
		}
		else if(req.isSocket && req.session.authenticated){
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
						request('http://api.tvmaze.com/shows', function (error, response, body) {
							var arr_from_json = JSON.parse( body );
							 
							console.log(arr_from_json);
						    // if (!error && response.statusCode == 200) {
						    //     console.log(body) // Print the google web page.
						    //  }
						})
						// CategoryStudent.find({student: data.back.user.id}).exec(function(error, cat){
						// 	if (!error && cat.length>0) {
						// 		if(data.back.user.photo!=null && data.back.user.photo!=''){
						// 			res.json({redirect: false, user: data.back.user});
						// 		}
						// 		else{
						// 			res.json({redirect:true, view:"/Student/MyProfile"});
						// 		}
						// 	}else{
						// 		res.json({redirect:true, view:"/Register/Student/Categories"});
						// 	}
						// });

					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPublicController -> home: "+error);
			}
		}
	},
	register_course: function(req, res, next){
		if(!req.isSocket && req.session.authenticated){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("private/index");
		}
		else if(req.isSocket && req.session.authenticated){
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
						res.json({user: data.back.user});

					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPublicController -> home: "+error);
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
	payment_enrollment: function(req, res, next){
		if(!req.isSocket){
			console.log("es http: "+req.session.authenticated);
			if (req.session.authenticated) {
				console.log("http authenticated");
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
							req.session.userId=user.id;
							req.session.authenticated=true;
							validateEnrollmentData(data);
						}else{
							req.session.destroy(function(){res.redirect("/");});
						}
					});
				}catch(error){
					res.view(500);
				}

				function validateEnrollmentData(data){
					try{
						Enrollment.find({id:data.front.idEnrollment}).exec(function(error,enrollment){
							if(!error && enrollment.length > 0){
								data.back.enrollment = enrollment[0];
								//req.session.save(function(error){
									res.view("private/index",{data:{user:data.session}});
								//});
							}else{
								res.view(404);
							}
						});
					}catch(error){
						res.view(404);
					}
				}
			}
		}else if(req.isSocket){
			console.log("es socket: "+req.session.authenticated);
			if (req.session.authenticated) {
				console.log("socket authenticated");
				try{
					var data={
						front: req.params.all(),
						back: {},
						session: {}
					};
					console.log("1b-");
					tools.validateUser(req.session.userId,function(error,user){
						if(!error && user){
							data.session = user;
							data.session.settings = req.session.settings;
							data.back.user = data.session;
							validateEnrollmentDataViaSocket(data);
						}else{
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					});
					function validateEnrollmentDataViaSocket(data){
						try{
							Enrollment.find({id:data.front.idEnrollment}).populate("period").exec(function(error,enrollment){
								if(!error && enrollment.length > 0){
									data.back.enrollment = enrollment[0];
									console.log("2-");
									CoursePeriod.find({id: data.back.enrollment.period.id}).populate("teacher").populate("schedule").exec(function(error, period){
										if (!error) {
											console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
											data.back.enrollment.period=period[0];
											console.log(data.back.enrollment.period);
											get_populates();
										}
									});
								}else{
									req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
								}
							});
							function get_populates(){
								Course.find({id: data.back.enrollment.period.course}).populate("categories").exec(function(error, course){
									if (!error && course.length > 0) {
										data.back.enrollment.period.course=course[0];
										User.find({id: data.back.enrollment.period.teacher.id}).populate("categories_teacher").populate("type_teacher").exec(function(error, teacher){
											if (!error && teacher.length>0) {
												data.back.enrollment.period.teacher=teacher[0];
												res.json(data.back);
											}
										});
									}
								});

							}
						}catch(error){
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					}
				}catch(error){
					res.view(500);
				}
			}
		}
	},
	/*payment_enrollment: function(req, res, next){
		if (!req.isSocket && req.session.authenticated) {
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
						console.log("1a-");
						validateEnrollmentData(data);
					}else{
						req.session.destroy(function(){res.redirect("/");});
					}
				});
			}catch(error){
				res.view(500);
			}

			function validateEnrollmentData(data){
				try{
					Enrollment.find({id:data.front.idEnrollment}).exec(function(error,enrollment){
						if(!error && enrollment.length > 0){
							data.back.enrollment = enrollment[0];
							console.log("2a-");
							res.view("private/index",{data:{user:data.session}});
						}else{
							res.view(404);
						}
					});
				}catch(error){
					res.view(404);
				}
			}
		}else if(req.isSocket && req.session.authenticated){
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				console.log("1b-");
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.session.settings = req.session.settings;
						data.back.user = data.session;
						validateEnrollmentDataViaSocket(data);
					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
				function validateEnrollmentDataViaSocket(data){
					try{
						Enrollment.find({id:data.front.idEnrollment}).populate("period").exec(function(error,enrollment){
							if(!error && enrollment.length > 0){
								data.back.enrollment = enrollment[0];
								console.log("2-");
								get_populates();
							}else{
								req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
							}
						});
						function get_populates(){
							Course.find({id: data.back.enrollment.period.course}).populate("categories").exec(function(error, course){
								if (!error && course.length > 0) {
									data.back.enrollment.period.course=course[0];
									User.find({id: data.back.enrollment.period.teacher}).populate("categories_teacher").populate("type_teacher").exec(function(error, teacher){
										if (!error && teacher.length>0) {
											data.back.enrollment.period.teacher=teacher[0];
											console.log("d");
											res.json(data.back);
										}
									});
								}
							});

						}
					}catch(error){
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				}
			}catch(error){
				res.view(500);
			}
		}else{
			console.log("req: "+req.isSocket);
		}
	}*/
	detailCourse: function(req, res, next){
		console.log("private");
		console.log("se: "+req.session.authenticated);
		console.log("soc: "+req.isSocket);
		if(!req.isSocket && !req.session.authenticated){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("public/index");
		}

		else if(!req.isSocket && req.session.authenticated){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("private/index");
		}
		else if(req.isSocket && req.session.authenticated){
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
						res.json({user: data.back.user});

					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPublicController -> home: "+error);
			}
		}else if(req.isSocket && !req.session.authenticated){
			try{
				var data={
					front: req.params.all(),
					back: {}
				};
				CoursePeriod.find({id: data.front.idPeriod, state:'active', status: true}).populate('course').populate('teacher').populate('schedule').exec(function(error, period){
					if (!error && period) {
						data.back.course=period[0];
						res.json({
							error: false,
							elements: data.back.course
						});
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}catch(error){
				console.log("Error PublicViewsController -> course_detail: "+error);
			}
		}else{
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("private/index");
		}
	},
	course_detail_private: function(req,res,next){
		if(req.isSocket){
			if (req.session.authenticated) {
				try{
					var data={
						front: req.params.all(),
						back: {}
					};
					tools.validateUser(req.session.userId,function(error,user){
						if(!error && user){
							data.session = user;
							data.session.settings = req.session.settings;
							data.back.user = data.session;
							console.log("buesco");
							get_period(data);

						}else{
							req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
						}
					});
					function get_period(data){
						CoursePeriod.find({id: data.front.period, status: true}).populate('course').populate('teacher').populate('schedule').exec(function(error, period){
								if (!error && period) {
									data.back.course=period[0];
									Course.find({id: data.back.course.course.id, status: true}).populate("type").exec(function(error, course){
										if (!error && course) {
											data.back.course.course = course[0];
											CategoryCourse.find({course: data.back.course.course.id, status: true}).populate("category").exec(function(error, categories){
												if (!error && categories) {
													data.back.course_cat=categories;
													CategoryTeacher.find({teacher: period[0].teacher.id}).populate("category").exec(function(error, teacher){
														if (!error && teacher) {
															data.back.course.teacher.categories=teacher;
															ratings();
														}
													});
												}
												function ratings(){
													Ratings.find({course: data.back.course.course.id, teacher: data.back.course.teacher.id}).average('number').exec(function(error, average){
														console.log("dddddddddddddddddddddddddd");
														if (!error) {
															if(average[0]){
																data.back.course.rating=average[0].number;
															}else{
																data.back.course.rating=0;
															}
															Ratings.count({course: data.back.course.course.id, teacher: data.back.course.teacher.id}).exec(function(error, count){
																if(!error){
																	data.back.course.count=count;
																	Ratings.count({period: data.back.course.id, student: data.session.id}).exec(function(error, count2){
																		if (!error) {
																			if (count2>0) {
																				data.back.course.rankeado=true;
																			}else{
																				data.back.course.rankeado=false;
																			}
																			res.json({
																				error: false,
																				elements: data.back.course,
																				course_cat: data.back.course_cat
																			});
																		}
																	});

																}
															});
														}
													});
												}
											});
										}
									});

								//	get_populate(data);
								}else{
									console.log(error)
									res.json({
										error: true,
										content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
									});
								}
						});
					}

				}catch(error){
					console.log("Error PrivateViewsController -> course_detail: "+error);
				}
			}else{
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}

		}
	},
	invitation_enrollment : function(req, res, next){
		if (!req.isSocket &&  req.session.authenticated) {
			console.log("http, session");
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user) {
					// body...
					if (!error) {
						data.back.user=user;
						data.session = user;
						data.session.settings = req.session.settings;
						console.log(data.front.id);
						Enrollment.find({id: data.front.idEnrollment}).exec(function(error, enrollment){
							if (!error) {
								//data.back.enrollment=enrollment[0];
								console.log("private");
								res.view('private/index',{data:{user:data.session}});
							}
							else{
								res.view(404);
							}
						});
					}
				});

			}catch(error){
				console.log("Error PrivateViewsController--> invitation_enrollment 0 "+error);
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}else if(req.session.authenticated && req.isSocket){
			console.log("dd");
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user) {
					// body...
					if (!error) {
						data.back.user=user;
						data.session = user;
						data.session.settings = req.session.settings;
						console.log(data.front.id);
						Enrollment.find({id: data.front.idEnrollment}).populate("period").exec(function(error, enrollment){
							if (!error) {
								data.back.enrollment=enrollment[0];
								CoursePeriod.find({id: enrollment[0].period.id}).populate("teacher").populate("course").populate('schedule').exec(function(error, period) {
									// body...
									if(!error){
										data.back.enrollment.period=period[0];
										res.json({
											error: false,
											enrollment: data.back.enrollment,
											user: data.back.user
										});
									}
								});
							}
						});
					}
				});

			}catch(error){
				console.log("Error PrivateViewsController--> invitation_enrollment 0 "+error);
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}
	},
	my_profile: function(req, res, next){
		if (!req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user) {
					// body...
					if (!error) {
						data.back.user=user;
						data.session = user;
						data.session.settings = req.session.settings;
						res.view('private/index',{data:{user:data.session}});
					}
					else{
						res.view(404);
					}
				});
			}catch(error){
				console.log("Error PrivateViewsController--> my_profile 0 "+error);
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}else if(req.isSocket && req.session.authenticated){
			try{
				console.log("so");
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user) {
					// body...
					if (!error) {
						data.back.user=user;
						data.session = user;
						data.session.settings = req.session.settings;
						console.log("w");
						res.json({
							error: false,
							user: data.back.user
						});
					}
					else{
						console.log("pri");
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error PrivateViewsController--> my_profile 1 "+error);
				req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
			}
		}
	},

	invitation_accept: function(req, res, next){
		if (!req.isSocket) {
			if (!req.session.authenticated) {
				try{
					var data={
						front: req.params.all(),
						back: {},
						session: {}
					};
					Enrollment.find({id: data.front.idEnrollment}).exec(function(error, enrollment){
						if (!error) {
							console.log("public");
							res.view('public/index',{data:{user:data.session}});
						}
						else{
							res.view(404);
						}
					});
				}catch(error){
					console.log("Error PrivateViewsController--> invitation_accept 0 "+error);
				}
			}else if(req.session.authenticated){
				try{
					var data={
						front: req.params.all(),
						back: {},
						session: {}
					};
					tools.validateUser(req.session.userId, function(error, user) {
						// body...
						if (!error) {
							data.back.user=user;
							data.session = user;
							data.session.settings = req.session.settings;
							console.log(data.front.id);
							Enrollment.find({id: data.front.idEnrollment}).exec(function(error, enrollment){
								if (!error) {
									//data.back.enrollment=enrollment[0];
									console.log("private");
									res.view('private/index',{data:{user:data.session}});
								}
								else{
									res.view(404);
								}
							});
						}
					});

				}catch(error){
					console.log("Error PrivateViewsController--> invitation_accept 1 "+error);
					req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
				}
			}
		}else if(req.isSocket){
			if (!req.session.authenticated) {
				try{
					var data={
						front: req.params.all(),
						back: {},
						session: {}
					};
					Enrollment.find({id: data.front.idEnrollment}).populate("period").exec(function(error, enrollment){
						if (!error) {
							data.back.enrollment=enrollment[0];
							CoursePeriod.find({id: enrollment[0].period.id}).populate("teacher").populate("course").populate('schedule').exec(function(error, period) {
								// body...
								if(!error){
									data.back.enrollment.period=period[0];
									res.json({
										error: false,
										enrollment: data.back.enrollment,
									});
								}
							});
						}
					});
				}catch(error){
					console.log("Error PrivateViewsController--> invitation_enrollment 0 "+error);
				}
			}else if(req.session.authenticated){
				try{
					var data={
						front: req.params.all(),
						back: {},
						session: {}
					};
					tools.validateUser(req.session.userId, function(error, user) {
						// body...
						if (!error) {
							data.back.user=user;
							data.session = user;
							data.session.settings = req.session.settings;
							console.log(data.front.id);
							Enrollment.find({id: data.front.idEnrollment}).populate("period").exec(function(error, enrollment){
								if (!error) {
									data.back.enrollment=enrollment[0];
									CoursePeriod.find({id: enrollment[0].period.id}).populate("teacher").populate("course").populate('schedule').exec(function(error, period) {
										// body...
										if(!error){
											data.back.enrollment.period=period[0];
											res.json({
												error: false,
												enrollment: data.back.enrollment,
												user: data.back.user
											});
										}
									});
								}
							});
						}
					});

				}catch(error){
					console.log("Error PrivateViewsController--> invitation_enrollment 0 "+error);
					req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
				}
			}
		}
	},

};
