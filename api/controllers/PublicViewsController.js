/**
 * PublicViewsController
 *
 * @description :: Server-side logic for managing Publicviews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools");

module.exports = {
	home : function(req,res,next){
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			
			if(req.session.authenticated){
				console.log("ss");
				searchUser(data);
			}else{
				console.log("ss2");
				res.view("public/index", {data:{user:"busqueda"}});
			}
			function searchUser(data){
				try{
					tools.validateUser(req.session.userId,function(error,user){
						if(!error && user){
							data.session = user;
							if(data.session.client || data.session.company|| data.session.admin){
								res.view("private/index",{data:{user:data.session}});
							}else{
								req.session.destroy(function(){
									res.view("public/index");
								});
							}
						}else{
							req.session.destroy(function(){
								res.view("public/index");
							});
						}
					});
				}catch(error){
					console.log("Error ViewPublicController -> searchUser: "+error);
				}
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
						data.back.user = data.session;
						res.json({user: data.back.user, redirect:true});
						
					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPublicController -> home: "+error);
			}
		}else{
			res.json({eror: false, redirect:false});
		
		}
	},
	register_teacher : function(req,res,next){
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			
			res.view("public/index");
		}
	},
	register_student : function(req,res,next){
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			
			res.view("public/index");
		}
	},
	login : function(req,res,next){
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
				res.view("public/index");
		}
	},
	course_detail : function(req,res,next){
		if(!req.isSocket){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			
			res.view("public/index");
		}else if(req.isSocket){
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
					//	get_populate(data);
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
				function get_populate(data){
					CategoryCourse.find({course: data.back.course.course.id, status: true}).populate("category").exec(function(error, categories){
						if (!error && categories) {
							data.back.course.course.categories=categories;
							CategoryTeacher.find({teacher: data.back.course.teacher.id}).populate("category").exec(function(error, teacher){
								if (!error && teacher) {
									data.back.course.teacher.categories_teacher=teacher;
									console.log(data.back.course.teacher.categories_teacher[0]);
									res.json({
										error: false,
										elements: data.back.course
									});
								}
							});
						}
					});
				};
			}catch(error){
				console.log("Error PublicViewsController -> course_detail: "+error);
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
							res.view('public/index');
						}
						else{
							res.view(404);
						}
					});
				}catch(error){
					console.log("Error PublicViewsController--> invitation_accept 0 "+error);
				}
			}
		}else if(req.isSocket){
			if (!req.session.authenticated) {
				try{
					var data={
						front: req.params.all(),
						back: {},
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
					console.log("Error PublicViewsController--> invitation_enrollment 0 "+error);
				}
			}
		}
	},
	
};