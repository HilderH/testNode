/**
 * CourseController
 *
 * @description :: Server-side logic for managing course
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools");
var async = require("async");
var ip='http://localhost:1337';
var MP = require ("mercadopago");

var mp = new MP ("TEST-8533599848126271-062810-8b31ed46c7222c2d1404de1b166550ca__LA_LC__-262280626");
module.exports = {
	register_course_new: function (req, res, next) {
		if(req.isSocket && req.session.authenticated){
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.session.settings = req.session.settings;

						data.back.dataToCreate={
							name: data.front.name.value,
							description: data.front.description.value,
							question_student: data.front.question_student.value,
							question_addressed: data.front.question_addressed.value,
							methodology: data.front.methodology.value,
							recommendations: data.front.recommendations.value,
							type: data.front.type,
							status: true
						};
						data.back.photo=data.front.photo[0];
						uploadimage();

						function uploadimage(){
							try{
								cicle1(0);
								function cicle1(i){
									data.back.photo.name = "/images/courses/"+tools.generateRandomCode(50)+"."+data.back.photo.value.substring(data.back.photo.value.indexOf("/")+1,data.back.photo.value.indexOf(";"));
									tools.existFile({name:data.back.photo.name},function(exist){
										if(!exist){
											tools.uploadFile({name:data.back.photo.name,value:data.back.photo.value.split(",")[1]},function(error){
												if(!error){
													data.back.dataToCreate.picture = data.back.photo.name;
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
										Course.create(data.back.dataToCreate).exec(function(error, course){
											if(!error && course){
												data.back.course=course;
												register_category(0);
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
						function register_category(i){
							if(data.front.categories[i]){
								CategoryCourse.create({course: data.back.course.id, category: data.front.categories[i].id, status:true}).exec(function(error, category){
									if (!error) {
										register_category(i+1);
									}
								});
							}else{
								res.json({
									error: false,
									content: ['El curso se ha registrado'],
									course: data.back.course
								});
							}
						}

					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			} catch(error){
				console.log("Error CourseController -> register_course: "+error);

			}
		}
	},
	fin_types: function(req, res, next){
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
						TypeCourse.find({status: true}).exec(function(error, types){
							if(!error){
								data.back.types=types;
								res.json({
									error: false,
									elements: data.back.types
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
	find_courses: function(req, res, next){
		if (req.isSocket) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session:{}
				};
				Course.find({status:true}).populate("type").populate("categories").exec(function(error, courses){
					if (!error) {
						res.json({
							error: false,
							elements: courses
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
				console.log("Error UserController -> find_courses -> 1: "+error);
			}
		}
	},
	activate_course: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session:{}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						data.back.dataToCreate={
							address: data.front.address.value,
							cost: data.front.cost.value,
							teacher: data.front.teacher.id,
							course: data.front.course.id,
							days: data.front.days.value,
							date_init: data.front.schedule[0].date1,
							date_finish: data.front.schedule[data.front.schedule.length-1].date1,
							status: true,
							state: 'active'
						};
						CoursePeriod.create(data.back.dataToCreate).exec(function(error, period){
							if (!error && period) {
								data.back.period=period;
								register_schedule(0);
								function register_schedule(i){
									var schedule={
										period: data.back.period.id,
										date: data.front.schedule[i].date1,
										hour_init: data.front.schedule[i].date1,
										hour_finish: data.front.schedule[i].date_finish.value,
										status:true,
									};
									Schedule.create(schedule).exec(function(err, sche){
										if (!error) {
											if (data.front.schedule[i+1]) {
												register_schedule(i+1);
											}else{
												buscar_por_categoria(data);

											}
										}else{
											res.json({
												error: true,
												content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
											});
										}
									});
								}
								function buscar_por_categoria(data){
									CategoryCourse.find({course:data.front.course.id}).populate("category").exec(function(error, categories){
										if (!error && categories.length>0) {
											console.log("dadddasdddddddddddddddddddddddddddddddddddddddd");
											data.back.categories=categories;
											var students=[];
											cicle(0);
											function cicle(i){
												console.log("CATEGORIE "+data.back.categories[i].category.id);
												console.log(data.back.categories[i].category);
												CategoryStudent.find({category: data.back.categories[i].category.id}).populate("student").exec(function(error, student){
													if (!error && student.length>0) {
														if (i==0) {
															for(var p=0; p<student.length; p++){
																students.push(student[p].student);
															}
														}else{
															for(var v=0; v< student.length; v++){
																var esta=false;
																var indice=0;
																for(var t=0; t<students.length; t++){
																	if (students[t].id==student[v].student.id) {
																		esta=true;
																		indice=v;
																	}
																}
																if (!esta) {
																	students.push(student[indice].student);
																}
															}
														}
														if (data.back.categories[i+1]) {
															console.log("CICLE");
															cicle(i+1);
														}else{
															console.log("ppp");
															sendNotifi();
															function sendNotifi(){
																var onesignals=[];
																console.log("va a enviar A"+students.length);
																console.log(students);
																for(var o=0; o<students.length; o++){
																	onesignals.push(students[o].oneSignalID);
																}
																console.log("push A");
																console.log(onesignals);
																tools.sendNotificationPush('Se ha aperturado las inscripciones para el curso '+data.front.course.name+'! Chequea su información!',onesignals, ip+'/Course/Private/'+data.back.period.id);
																timer24(data.back.period);
																timerComienzo(data.back.period);
																timerFeedback(data.back.period);
																timerFinish(data.back.period);
																res.json({
																	error: false,
																	content: ['Curso activado con exito']
																});

																sails.sockets.broadcast("students","refreshCoursesList");
																sails.sockets.broadcast("teachers","refreshCoursesList");
															}
														}
													}else{

															console.log("ddddddddddddddd");
														if (data.back.categories[i+1]) {
															console.log("CICLE");
															cicle(i+1);
														}else{
															console.log("ppp");
															sendNotifi();
															function sendNotifi(){
																var onesignals=[];
																console.log("va a enviar B"+students.length);
																console.log(students);
																for(var o=0; o<students.length; o++){
																	onesignals.push(students[o].oneSignalID);
																}

																console.log("push B");
																console.log(onesignals);
																tools.sendNotificationPush('Se ha aperturado las inscripciones para el curso '+data.front.course.name+'! Chequea su información!',onesignals, ip+'/Course/Private/'+data.back.period.id);
																timer24(data.back.period);
																timerComienzo(data.back.period);
																timerFeedback(data.back.period);
																timerFinish(data.back.period);
																res.json({
																	error: false,
																	content: ['Curso activado con exito']
																});

																sails.sockets.broadcast("students","refreshCoursesList");
																sails.sockets.broadcast("teachers","refreshCoursesList");
															}
														}
														//res.json({
														//	error: false,
														//	content: ['Curso activado con exito']
														//});
													}
												});
											}
										}else{
											console.log("ddddddddddddddd---------------");
											timer24(data.back.period);
											timerComienzo(data.back.period);
											timerFeedback(data.back.period);
											timerFinish(data.back.period);
											res.json({
													error: false,
													content: ['Curso activado con exito']
												});
											sails.sockets.broadcast("students","refreshCoursesList");
											sails.sockets.broadcast("teachers","refreshCoursesList");

										}
									});
								}

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
				function timer24(period){
					var now = new Date();
					now = Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds());
					var date_init = new Date(data.front.schedule[0].date1);
					date_init = Date.UTC(date_init.getFullYear(),date_init.getMonth(),date_init.getDate()-1,date_init.getHours(),date_init.getMinutes(),date_init.getSeconds());

					var date = date_init - now;
					var period=period;
					setTimeout(function(){
						Enrollment.find({period: period.id}).populate("student").exec(function(error, enrollment){
							if (!error && enrollment.length>0) {
								var enrollment=enrollment;
								var notifis=[];
								for(var i=0; i<enrollment.length; i++){
									notifis.push(enrollment[i].student.oneSignalID);
								}
								tools.sendNotificationPush('El curso '+data.front.course.name+' comienza en 24 horas!', notifis, ip+'/Course/Private/'+period.id);
								send(0);
								function send(i){
									var email={
										from: 'Bloxie School',
										to: enrollment[i].student.email,
										body: enrollment[i].student.name+', queda solo 1 día para empezar tu <strong>'+data.front.course.type.name+' de '+data.front.course.name+'</strong>  ✋ <br><br>Te invitamos a que te prepares lo mejor posible para sacarle el máximo provecho a esta nueva experiencia. <br>br>Ingresa en nuestra app y conoce a tus compañeros de clase, revisa el contenido disponible del curso e investiga sobre los temas que se exponen allí, para que entres lo más conectado posible a la clase <br><br>¡Nos vemos pronto!',
										title: 'Queda solo 1 día para empezar tu '+data.front.course.type.name+' de '+data.front.course.name,
										subject: 'Queda solo 1 día para empezar tu '+data.front.course.type.name+' de '+data.front.course.name+' ✋',
										href:ip,
										nameButton: 'IR A LA APP',
										footer: 'Bloxie School Staff.'
									};
									tools.sendEmail(email, function(error){
										if (!error) {
											if (enrollment[i+1]) {
												send(i+1);
											}else{
												var email={
													from: 'Bloxie',
													to: data.front.teacher.email,
													body: data.front.teacher.name+', el curso <strong>'+data.front.course.name+'</strong>  comienza en 24 horas!<br> Preparate para dar tu clase!',
													title: 'El curso '+data.front.course.name+'  comienza en 24 horas!',
													subject: 'El curso '+data.front.course.name+'  comienza en 24 horas!',
													href: ip,
													nameButton: 'Ir a Bloxie',
													footer: 'Cordialmente, <br> Equipo Bloxie.'
												};
												tools.sendEmail(email, function(error){
													if (!error) {
													}
												});
												tools.sendNotificationPush('El curso '+data.front.teacher.name+' comienza en 24 horas!', [data.front.teacher.oneSignalID], ip+'/Course/Private/'+enrollment[i].period);
												sails.sockets.broadcast("students","refreshCoursesList");
												sails.sockets.broadcast("teachers","refreshCoursesList");

											}
										}
									});
								}

							}
						});
					},date);
				}

				function timerComienzo(period){
					var now = new Date();
					now = Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds());
					var date = new Date(data.front.schedule[0].date1);
					date = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
					date = date - now;
					var period=period;
					setTimeout(function(){
						period.state = 'progress';
						period.save(function(error){
							if(!error){
								Enrollment.find({period: period.id}).populate("student").exec(function(error, enrollment){
									if (!error && enrollment.length>0) {
										var enrollment=enrollment;
										var notifis=[];
										for(var i=0; i<enrollment.length; i++){
											notifis.push(enrollment[i].student.oneSignalID);
										}
										tools.sendNotificationPush('El curso '+data.front.course.name+' ha comenzado!', notifis, ip+'/Course/Private/'+period.id);

										send(0);
									}
									function send(i){
										var email={
											from: 'Bloxie School',
											to: enrollment[i].student.email,
											body: enrollment[i].student.name+', ha comenzado tu <strong>'+data.front.course.type.name+' de '+data.front.course.name+'</strong> 😀<br><br> Durante el curso no te cohíbas, participa y pregunta a lo largo de toda la clase. <br><br>Piensa que tienes al frente una oportunidad especial de compartir con alguien que tiene gran conocimiento y experiencia sobre tu tema de interés. <br><br>¡Que lo disfrutes!',
											title: 'Ha comenzado tu '+data.front.course.type.name+' de '+data.front.course.name,
											subject: 'Ha comenzado tu '+data.front.course.type.name+' de '+data.front.course.name+' 😀',
											href:ip,
											nameButton: 'IR A LA APP',
											footer: 'Bloxie School Staff'

										};
										tools.sendEmail(email, function(error){
											if (!error) {
												if (enrollment[i+1]) {
													send(i+1);
												}else{
													var email={
														from: 'Bloxie',
														to: data.front.teacher.email,
														body: data.front.teacher.name+', el curso <strong>'+data.front.course.name+'</strong> ha comenzado!<br> Preparate para dar tu clase!',
														title: 'El curso '+data.front.course.name+' ha comenzado!',
														subject: 'El curso '+data.front.course.name+' ha comenzado!',
														href: ip,
														nameButton: 'Ir a Bloxie',
														footer: 'Cordialmente, <br> Equipo Bloxie.'
													};
													tools.sendEmail(email, function(error){
														if (!error) {

														}
													});
													sails.sockets.broadcast("students","refreshCoursesList");
													sails.sockets.broadcast("teachers","refreshCoursesList");

												}
											}
										});
									}
								});
							}
						});
					},date);
				}


				function timerFeedback(period){
					var now = new Date();
					now = Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds());
					var date = new Date(data.front.schedule[data.front.schedule.length-1].date_finish.value);
					date = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
					date = date - now;
					var period=period;
					setTimeout(function(){
						period.state = 'feedback';
						period.save(function(error){
							if(!error){
								Enrollment.find({period: period.id}).populate("student").exec(function(error, enrollment){
									if (!error && enrollment.length>0) {
										var enrollment=enrollment;
										var notifis=[];
										for(var i=0; i<enrollment.length; i++){
											notifis.push(enrollment[i].student.oneSignalID);
										}
										tools.sendNotificationPush('El curso '+data.front.course.name+' ha terminado!', notifis, ip+'/Course/Private/'+period.id);

										send(0);
									}
									function send(i){
										var email={

											from: 'Bloxie School',
											to: enrollment[i].student.email,
											body: enrollment[i].student.name+',  ha terminado tu  <strong>'+data.front.course.type.name+' de '+data.front.course.name+'</strong> ✋, sin embargo, la gran experiencia aun no termina❗ <br><br>No olvides participar en la sección de Preguntas y Respuestas con tu mentor, allí podrán compartir muchísima información valiosa para ambos y aclarar las dudas restantes del curso. <br><br>Adicionalmente,te invitamos a calificar el <strong>'+data.front.course.type.name+' de '+data.front.course.name+'</strong>, luego estarás a solo un click de obtener tu certificado. <br><br>Para nosotros ha sido un grato placer contar con tu participación, esperamos verte pronto de vuelta.<br><br>¡Mucho éxito!',
											title: 'Ha terminado tu '+data.front.course.type.name+' de '+data.front.course.name+'',
											subject: 'Ha terminado tu '+data.front.course.type.name+' de '+data.front.course.name+' ✋',
											href:ip,
											nameButton: 'IR A LA APP',
											footer: 'Bloxie School Staff'
										};
										tools.sendEmail(email, function(error){
											if (!error) {
												if (enrollment[i+1]) {
													send(i+1);
												}else{
													var email={
														from: 'Bloxie',
														to: data.front.teacher.email,
														body: data.front.teacher.name+', el curso <strong>'+data.front.course.name+'</strong> ha terminado!<br> Revisa y esta atento a las preguntas de los estudiantes!',
														title: 'El curso '+data.front.course.name+' ha terminado!',
														subject: 'El curso '+data.front.course.name+' ha terminado!',
														href: ip,
														nameButton: 'Ir a Bloxie',
														footer: 'Cordialmente, <br> Equipo Bloxie.'
													};
													tools.sendEmail(email, function(error){
														if (!error) {

														}
													});
													sails.sockets.broadcast("students","refreshCoursesList");
													sails.sockets.broadcast("teachers","refreshCoursesList");

												}
											}
										});
									}
								});
							}
						});
					},date);
				}

				function timerFinish(period){
					var now = new Date();
					now = Date.UTC(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds());
					var date = new Date(data.front.schedule[data.front.schedule.length-1].date_finish.value);
					date = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()+2,date.getHours(),date.getMinutes(),date.getSeconds());
					date = date - now;
					var period=period;
					setTimeout(function(){
						period.state = 'finish';
						period.save(function(error){
							if(!error){
								Enrollment.find({period: period.id}).populate("student").exec(function(error, enrollment){
									if (!error && enrollment.length>0) {
										var enrollment=enrollment;
										var notifis=[];
										for(var i=0; i<enrollment.length; i++){
											notifis.push(enrollment[i].student.oneSignalID);
										}
										send(0);
										tools.sendNotificationPush('el curso '+data.front.course.name+' ha terminado, Califica y obten tu certificado!', notifis, ip+'/Course/Private/'+period.id);
									}
									function send(i){
										var email={
											from: 'Bloxie School',
											to: enrollment[i].student.email,
											body: enrollment[i].student.name+',  ha terminado tu  <strong>'+data.front.course.type.name+' de '+data.front.course.name+'</strong> ✋, sin embargo, la gran experiencia aun no termina❗ <br><br>No olvides participar en la sección de Preguntas y Respuestas con tu mentor, allí podrán compartir muchísima información valiosa para ambos y aclarar las dudas restantes del curso. <br><br>Adicionalmente,te invitamos a calificar el <strong>'+data.front.course.type.name+' de '+data.front.course.name+'</strong>, luego estarás a solo un click de obtener tu certificado. <br><br>Para nosotros ha sido un grato placer contar con tu participación, esperamos verte pronto de vuelta.<br><br>¡Mucho éxito!',
											title: 'Ha terminado tu '+data.front.course.type.name+' de '+data.front.course.name+'',
											subject: 'Ha terminado tu '+data.front.course.type.name+' de '+data.front.course.name+' ✋',
											href:ip,
											nameButton: 'IR A LA APP',
											footer: 'Bloxie School Staff'
										};
										tools.sendEmail(email, function(error){
											if (!error) {
												if (enrollment[i+1]) {
													send(i+1);
												}else{
													var email={
														from: 'Bloxie',
														to: data.front.teacher.email,
														body: data.front.teacher.name+', el curso <strong>'+data.front.course.name+'</strong> ha terminado!<br> Revisa y esta atento a las preguntas de los estudiantes!',
														title: 'El curso '+data.front.course.name+' ha terminado!',
														subject: 'El curso '+data.front.course.name+' ha terminado!',
														href: ip,
														nameButton: 'Ir a Bloxie',
														footer: 'Cordialmente, <br> Equipo Bloxie.'
													};
													tools.sendEmail(email, function(error){
														if (!error) {

														}
													});
													sails.sockets.broadcast("students","refreshCoursesList");
													sails.sockets.broadcast("teachers","refreshCoursesList");

												}
											}
										});
									}
								});
							}
						});
					},date);
				}


			}catch(error){
				console.log("Error UserController -> find_courses -> 1: "+error);
			}
		}
	},
	find_courses_active: function(req, res, next){
		if (req.isSocket) {
			try{
				var data={
					front: req.params.all(),
					back:{}
				};

				CoursePeriod.find({status: true}).populate('course').populate('teacher').populate('schedule').sort('date_init ASC').exec(function(error, courses){
					if (!error && courses) {
						data.back.courses= courses;
						get_populates(0);
					}
				});
				function get_populates(index){
					if(typeof data.back.courses[index] != "undefined"){

						CategoryCourse.find({course: data.back.courses[index].course.id, status: true}).populate("category").exec(function(error, categories){
							if (!error && categories) {
								data.back.courses[index].course.categories=categories;
								get_populates(index+1);
							}
						})
					}else{
						if(data.back.courses[index+1]){
							get_populates(index+1);
						}else{
							res.json({
								error: false,
								elements: data.back.courses
							});
						}
					}
				}
			}catch(error){
				console.log("Error UserController -> find_courses_active -> 1: "+error);
			}
		}
	},
	find_category_by_teacher: function(req, res, next){
		if (req.isSocket) {
			try{
				var data={
					front: req.params.all(),
					back: {}
				};
				CategoryCourse.find({course: data.front.course, status: true}).populate("category").exec(function(error, categories){
					if (!error && categories) {
						data.back.categories=categories;
						CategoryTeacher.find({teacher: data.front.teacher}).populate("category").exec(function(error, teacher){
							if (!error && teacher) {
								data.back.categories_teacher=teacher;
								res.json({
									error: false,
									categories_teacher: data.back.categories_teacher,
									categories_course: data.back.categories
								});
							}
						});
					}
				});
			}catch(error){
				console.log("Error CourseController -> find_courses_active -> 1: "+error);
			}
		}
	},
	enrollment_new_user: function(req, res, next){
		if (req.isSocket) {
			try{
				var data={
					front: req.params.all(),
					back: {},
				};
				Search(data);
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
								var coins=data.back.manage.coinsHour*data.back.course.type.hours;
								 data.back.dataToCreate={
								 	name: data.front.name.value,
								 	lastname: data.front.lastname.value,
								 	username: data.front.username.value,
								 	email: data.front.email.value,
								 	password: tools.encryptCrypto('bloxie', data.front.password.value),
								 	student: true,
								 	coins: coins,
								 	status: true
								 };
								 User.create(data.back.dataToCreate).exec(function(error, user){
								 	if(!error){
								 		data.back.user=user;
								 		req.session.settings = {};
										req.session.authenticated = true;
										req.session.userId = data.back.user.id;
										req.session.save(function(error){
											if(!error){
										 		data.back.enrollmenToCreate={
													period: data.front.period,
													student: data.back.user.id,
													payment_state: false,
													quantity: data.front.quantity,
													validate: false,
												};
												Enrollment.create(data.back.enrollmenToCreate).exec(function(error, enrollment){
													if(!error && enrollment){
														//if(data.front.quantity>1){
															res.json({
																error: false,
																content: ['¡Registro exitoso!'],
																//view: '/Dashboard'
																view: '/Course/Enrollment/'+enrollment.id+'/Payment'
																//view: '/Course/Enrollment/'+enrollment.id+'/Invitation'
															});
														//}
														//else{
														//	res.json({
														//		error: false,
														//		content: ['¡Registro exitoso!'],
														//		view: '/Register/Student/Categories'
																//view: '/Course/Enrollment/'+enrollment.id+'/Payment'
														//	});
														//}
													}else{
														res.json({
															error: true,
															content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
														});
													}
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
							}
						});
					}catch(error){
						console.log("Error UserController -> register_teacher -> 2: "+error);
					}
				}
				function Search(data){
					try{
						Management.find().exec(function(error, manage){
							if (!error) {
								data.back.manage=manage[0];
								Course.find({id: data.front.course}).populate("type").exec(function(error, course){
									if (!error) {
										data.back.course=course[0];
										validateUsername(data);
									}
								});
							}
						});
					}catch(error){
						console.log("Error CourseController -> search -> 1: "+error);
					}
				}
			}catch(error){
				console.log("Error CourseController -> enrollment_new_user -> 1: "+error);
			}
		}
	},
	find_courses_student: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session:{}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;

						Enrollment.find({student: user.id}).populate('student').populate('period').exec(function(error, enrollment){

							if (!error && enrollment) {
								async.map(enrollment, findEvents, function iterador(err,results){


						          	return res.json({
										error: false,
										elements: results
									});

						        });
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});
							}
						});
						var findEvents = function (enrollment,endResult) {
					 		User.findOne( {where: {id: enrollment.period.teacher}} ).exec(function (error, teacher){



						 			enrollment.period.teacher = teacher;
							 		Course.findOne( {where: {id: enrollment.period.course}} ).exec(function (err, course){



							 				enrollment.period.course = course;
								 			return endResult(null,enrollment)

								 	});


						 	});
					 	}
					}
					else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});

			}catch(error){
				console.log("Error UserController -> find_courses -> 1: "+error);
			}
		}
	},
	enrollment_login: function(req, res, next) {
		// body...
		if(req.isSocket && !req.session.authenticated){
			try{
				var data={
					front: req.params.all(),
					back: {}
				};
				validateData(data);
			}catch(error){
				console.log("Error CourseController -> enrollment_login -> 1: "+error);
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
					console.log("CourseController > enrollment_login > 2: "+error);
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
					console.log("CourseController > enrollment_login > 3: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function login(data){
				try{
					req.session.settings = {};
					req.session.authenticated = true;
					req.session.userId = data.back.user.id;
					if (data.back.user.student) {
						req.session.save(function(error){
							if(!error){
								data.back.enrollmenToCreate={
									period: data.front.course,
									student: data.back.user.id,
									payment_state: false,
									quantity: data.front.quantity
								};
								Enrollment.find({student: data.back.user.id, period: data.front.course}).exec(function(error, en){
									if (!error && en.length==0) {
										Enrollment.create(data.back.enrollmenToCreate).exec(function(error, enrollment){
											if(!error && enrollment){
												res.json({
													error: false,
													content: ['¡Sesion Iniciada!'],
													//view: '/Dashboard'
													view: '/Course/Enrollment/'+enrollment.id+'/Payment'
												});
											}else{
												res.json({
													error: true,
													content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
												});
											}
										});
									}else{
										res.json({error:true,content:["Ya estas inscrito en este curso, no puedes volver a inscribirte"]});
									}
								});

							}else{
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						});
					}else{
						console.log("adminaaaaaaa");
						res.json({error:true,content:["No eres estudiante en bloxie, No puedes inscribirte en este curso"]});
					}
				}catch(error){
					console.log("CourseController > enrollment_login > 4: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}
		}
	},
	find_courses_active_teacher: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session:{}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.user=user;
						CoursePeriod.find({teacher: data.back.user.id, state:'active'}).populate('course').populate('schedule').exec(function(error, courses){
							if (!error && courses) {
								async.map(courses, findEvents, function iterador(err,results){
						          	return res.json({
										error: false,
										elements: results
									});
						        });
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});
							}
						});
						var findEvents = function (course,endResult) {
					 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
					 			course.course.categories_course = cat;
				 		 			return endResult(null,course)
						 	});
					 	}
					}
					else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});

			}catch(error){
				console.log("Error CourseController -> find_courses_teacher -> 1: "+error);
			}
		}
	},
	find_courses_list: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user){
					if (!error && user) {
						data.back.user=user;
						if (data.front.permission=='student') {
							if (data.front.state=='enrollment') {
								courses_enrollment(data);
							} else if(data.front.state=='active'){
								courses_actives(data);
							}else if(data.front.state=='category'){
								courses_student_categories(data);
							}
						}else if(data.front.permission=='teacher'){
							if(data.front.state=='active'){
								courses_enrollment_teacher(data);
							}else if(data.front.state=='progress'){
								courses_progress_teacher(data);
							}else if(data.front.state=='finish'){
								courses_finish_teacher(data);
							}
						}else if(data.front.permission=='admin'){
							if(data.front.state=='active'){
								courses_actives(data);
							} else if(data.front.state=='progress'){
								courses_progress_admin(data);
							} else if(data.front.state=='finish'){
								courses_finish_admin(data);
							}
						}
					}
				});
			}catch(error){
				console.log("Error CourseController -> find_courses_teacher -> 1: "+error);
			}
			function courses_enrollment(data){

				Enrollment.find({student: data.back.user.id}).populate('period').exec(function(error, enrollment){
					if (!error && enrollment.length>0) {
						var findEvents = function (enrollment,endResult) {
							CoursePeriod.findOne({where: {id: enrollment.period.id}}).populate('teacher').populate('schedule').populate('course').exec(function(error, per){
									if (!error) {
									enrollment.period=per;
									enrollment.shedule={shedule:per.schedule};
									return endResult(null,enrollment)
								}
							});
					 	};
						async.map(enrollment, findEvents, function iterador(err,results){
				          	return res.json({
								error: false,
								elements: results
							});
				        });
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}
			function courses_actives(data){
				CoursePeriod.find({state: 'active', status: true}).populate("course").populate("teacher").populate('schedule').exec(function(error, courses){
					if(!error && courses) {
						data.back.courses=courses;
						res.json({
							error: false,
							elements: data.back.courses
						});
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}
			function courses_student_categories(data){
				CategoryStudent.find({student: data.back.user.id}).exec(function(error, categories){
					if (!error) {
						if (categories.length>0) {
							data.back.user.categories_student=categories;
							data.back.courses_categories=[];
							data.back.courses=[];
							search_courses(data);
						}else{
							res.json({
								error: false,
								elements: []
							});
						}
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
				function search_courses(data){
					var i=0;
					var length=data.back.user.categories_student.length;
					cicle(0);
					function cicle(i){
						CategoryCourse.find({category: data.back.user.categories_student[i].category}).exec(function(error, course){
							if (!error && course) {
								if (course.length>0) {
									for(var j=0; j<course.length; j++){
										data.back.courses_categories.push(course[j]);
									}
									if (data.back.user.categories_student[i+1]) {
										cicle(i+1);
									}else{
										quitar_repetido(data);
									}
								}else{
									if (data.back.user.categories_student[i+1]) {
										cicle(i+1);
									}else{
										quitar_repetido(data);
									}
								}
							}
						});
					}
					function quitar_repetido(data){
						for(var i=0; i<data.back.courses_categories.length; i++){
							for(var j=i+1; j<data.back.courses_categories.length; j++){
								if (data.back.courses_categories[i].course==data.back.courses_categories[j].course) {
									data.back.courses_categories.splice(j,1);
								}
							}
						}
						find1(0);
						function find1(i){
							if (data.back.courses_categories.length>0) {
								CoursePeriod.find({course: data.back.courses_categories[i].course, state: 'active'}).populate('course').populate("teacher").populate('schedule').exec(function(error, courses){
									if (!error) {
										for(var t=0; t<courses.length; t++){
											data.back.courses.push(courses[t]);
										}
										if (data.back.courses_categories[i+1]) {
											find1(i+1);
										}else{
											res.json({
												error: false,
												elements: data.back.courses
											});
										}
									}else{
										res.json({
											error: true,
											content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
										});
									}
								});
							}else{
								res.json({
									error: false,
									elements: []
								});
							}

						}
					}
					//console.log("courses: "+data.back.courses_categories.length);
				}
			}
			function courses_enrollment_teacher(data){
				CoursePeriod.find({teacher: data.back.user.id, state: 'active'}).populate('course').populate('schedule').exec(function(error, courses){
					if (!error && courses) {
						var findEvents = function (course,endResult) {
					 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
					 			course.course.categories_course = cat;
				 		 			return endResult(null,course)
						 	});
					 	};
					 	console.log("yyw");
						async.map(courses, findEvents, function iterador(err,results){
				          	return res.json({
								error: false,
								elements: results
							});
				        });
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});

			}
			function courses_progress_teacher(data){
				CoursePeriod.find({teacher: data.back.user.id, state: ['progress','feedback']}).populate('course').populate('schedule').exec(function(error, courses){
					if (!error && courses) {
						async.map(courses, findEvents, function iterador(err,results){
				          	return res.json({
								error: false,
								elements: results
							});
				        });
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
				var findEvents = function (course,endResult) {
			 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
			 			course.course.categories_course = cat;
		 		 			return endResult(null,course)
				 	});
			 	}
			}
			function courses_finish_teacher(data){
				CoursePeriod.find({teacher: data.back.user.id, state: 'finish'}).populate('course').populate('schedule').exec(function(error, courses){
					if (!error && courses) {
						async.map(courses, findEvents, function iterador(err,results){
							console.log(results);
				          	return res.json({
								error: false,
								elements: results
							});

				        });
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
				var findEvents = function (course,endResult) {
			 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
			 			course.course.categories_course = cat;
		 		 			return endResult(null,course)
				 	});
			 	}
			}
			function courses_progress_admin(data){
				CoursePeriod.find({state: ['progress','feedback']}).populate('course').populate('schedule').exec(function(error, courses){
					if (!error && courses) {
						async.map(courses, findEvents, function iterador(err,results){
				          	return res.json({
								error: false,
								elements: results
							});
				        });
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
				var findEvents = function (course,endResult) {
			 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
			 			course.course.categories_course = cat;
		 		 			return endResult(null,course)
				 	});
			 	}
			}
			function courses_finish_admin(data){
				CoursePeriod.find({state: 'finish'}).populate('course').populate('schedule').exec(function(error, courses){
					if (!error && courses) {
						async.map(courses, findEvents, function iterador(err,results){
				          	return res.json({
								error: false,
								elements: results
							});
				        });
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
				var findEvents = function (course,endResult) {
			 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
			 			course.course.categories_course = cat;
		 		 			return endResult(null,course)
				 	});
			 	}
			}


		}
	},
	find_courses_finish_teacher: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user){
					if (!error && user) {
						data.back.user=user;
			
						CoursePeriod.find({teacher: data.back.user.id, state: 'finish'}).populate('course').populate('schedule').exec(function(error, courses){
							if (!error && courses) {
								data.back.courses=courses;
								//cicle(0);
								//function cicle(i){
								//	CategoryCourse.find({course: data.back.courses[i].course.id}).exec(function (error, cat){
							 	//		if (!error) { 			
							 				//data.back.courses[i].course.categories_course = cat;
						 		 			console.log("w");
						 		 //			if (data.back.courses[i+1]) {
						 		 //				cicle(i+1);
						 		 	//		}else{
						 		 				return res.json({
													error: false,
													elements: data.back.courses,
												});			
						 		 	//		}
						 		 	//	}
								 	//});
								//};
								/*var findEvents = function (course,endResult) {
							 		CategoryCourse.findOne( {where: {course: course.course.id}} ).exec(function (error, cat){
							 			if (!error) { 			
							 				course.course.categories_course = cat;
						 		 			console.log("wwwwwwwwwwwwwww");
						 		 			return endResult(null,course)
								 		}
								 	});
							 	};
								async.map(courses, findEvents, function iterador(err,results){
						          	return res.json({
										error: false,
										elements: results
									});
						        });*/
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});							
							}
						});
						
					}
				});
			}catch(error){
				console.log("Error CourseController -> find_courses_teacher -> 1: "+error);	
			}
		}
	},
	find_students_course: function(req, res, next){
		console.log("end point")
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.session.settings = req.session.settings;
						var seeChat = false;
						Enrollment.find({period: data.front.id, }).populate("student").exec(function(error, enrrollment){
							if (!error) {
								data.back.users=[];
								data.back.seeChat=false;
								for(var i=0; i<enrrollment.length; i++){
									data.back.users.push(enrrollment[i].student);
									if (enrrollment[i].student.id == data.session.id) {
										var seeChat = true;
									};

								}
								if(data.back.users.length>0){
									search_categorie(0);
								}else{
									res.json({
										error: false,
										elements: data.back.users,
										seeChat: seeChat
									});
								}
								function search_categorie(i){
									var cats = [];
									User.find({id: data.back.users[i].id}).populate("categories_student").exec(function(error, user){
										if (!error) {
												data.back.users[i]=user[0];
												async.map(data.back.users[i].categories_student, findCats, function iterador(err,results){
										          	data.back.users[i].categories_student = results
										          	if (data.back.users[i+1]) {
														search_categorie(i+1);
													}else{
														res.json({
															error: false,
															elements: data.back.users,
															seeChat: seeChat
														});
													}
										        });
										}
									});
								}
								var findCats = function (cat,endResult) {
							 		Category.findOne( {where: {id: cat.category}} ).exec(function (error, cate){
							 			cat.category = cate;
						 		 			return endResult(null,cat)
								 	});
							 	}
								//console.log("elemnt despues: "+data.back.users.length);
								//res.json({
								//	error: false,
								//	elements: data.back.users,
								//	seeChat: seeChat
								//});
							}else{
								res.json({
									error: true,
									content: ['Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde']
								});
							}
						});
					}
					else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
				});

			}catch(error){
				console.log("CourseController > find_students_course > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	register_question: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.back.dataToCreate={
							question: data.front.question.value,
							period: data.front.period.value,
							student: data.session.id,
							status: true,
						};
						Management.find().exec(function(error, manage){
							if (!error) {
								data.back.manage=manage[0];
								if (data.back.manage.coinsQuestion<=data.session.coins) {
									QuestionCourse.create(data.back.dataToCreate).exec(function(error, question){
										if (!error) {
											data.session.coins-=data.back.manage.coinsQuestion;
											data.session.save(function(error){
												if (!error) {
													res.json({
														error: false,
														content: ['Tu pregunta se ha enviado'],
														cleanFields: true
													});
													sails.sockets.broadcast("students","refreshMsgChat",{ period: data.front.period.value });
													sails.sockets.broadcast("teachers","refreshMsgChat",{ period: data.front.period.value });
													tools.sendNotificationPush('Te han hecho una pregunta en el curso '+data.front.course.name, [data.front.onesignal_teacher], ip+'/Course/Private/'+data.front.period.value);

												}else{
													res.json({
														error:true,
														content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
													});
												}
											});
										}else{
											res.json({
												error:true,
												content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
											});
										}
									});
								}else{
									res.json({
										error:true,
										content:["Lo sentimos, no tienes suficientes monedas para procesar la transaccion"]
									});
								}
							}
						});

					}else{
						res.json({
							error:true,
							content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
						});
					}
				});
			}catch(error){
				console.log("CourseController > register_question > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	find_questions_course: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			console.log("827");
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						console.log("11");
						data.session = user;
						data.session.settings = req.session.settings;
						QuestionCourse.find({period: data.front.period, status:true}).populate("student").populate("answer").exec(function(error, questions){
							if (!error) {
								var findEvents = function (questions,endResult) {
						 			if (questions.answer.length>0) {
						 				if (!questions.answer[0].payout) {
								 			return endResult(null,questions)
						 				}else{
						 					if (data.session.teacher) {
						 						questions.answer[0].payment=true;
						 						return endResult(null,questions)
						 					}else if(data.session.student){
							 					if (data.session.id==questions.student.id) {
							 						questions.answer[0].payment=true;
							 						return endResult(null,questions)
							 					}else{
								 					PaymentAnswer.find({answer: questions.answer[0].id, student: data.session.id, status: true}).exec(function(error, pay){
											 			if (!error) {
											 				if (pay.length>0) {
											 					questions.answer[0].payment=true;
											 				}else{
											 					questions.answer[0].payment=false;
											 				}
											 				return endResult(null,questions)
											 			}
											 		});
								 				}
							 				}
						 				}
						 			}else{
						 				return endResult(null,questions)
						 			}

							 	};
								async.map(questions, findEvents, function iterador(err,results){
									res.json({
										error: false,
										elements: results
									});
						        });
							}else{
								res.json({
									error:true,
									content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
								});
							}
						});
					}
				});

			}catch(error){
				console.log("CourseController > find_questions_course > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	register_answer: function(req,res,next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user){
					if (!error) {
						data.back.dataToCreate={
							question: data.front.question.value,
							text: data.front.text.value,
							payout: data.front.free.value,
							status: true
						};
						console.log("ID ONESIGNAL: ");
						console.log(data.front.oneSignalID);

						data.back.audio=data.front.audio;
						//console.log(data.front.audio)
						if (data.front.audio.value == '' && data.front.text.value != '') {
							AnswerCourse.create(data.back.dataToCreate).exec(function(error, anser){
								if (!error) {
									res.json({
										error: false,
										content: ['Tu respuesta se ha enviado']
									});

									console.log("ID ONESIGNAL: ");
									console.log(data.front.oneSignalID);
									sails.sockets.broadcast("students","refreshMsgChat",{ period: data.front.period.value });
									sails.sockets.broadcast("teachers","refreshMsgChat",{ period: data.front.period.value });
									tools.sendNotificationPush('Te han respondido en el curso '+data.front.course.name, [data.front.student.value.oneSignalID], ip+'/Course/Private/'+data.front.period.value);

								}else{
									res.json({
										error:true,
										content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
									});
								}
							});
						}else{
							if (data.front.audio.value != '' && data.front.text.value == '') {
								uploadimage();
								function uploadimage(){
									try{
										cicle1(0);
										function cicle1(i){
											data.back.audio.name = "/audios/audio_"+tools.generateRandomCode(50)+"."+data.back.audio.value.substring(data.back.audio.value.indexOf("/")+1,data.back.audio.value.indexOf(";"));
											tools.existFile({name:data.back.audio.name},function(exist){
												if(!exist){
													tools.uploadFile({name:data.back.audio.name,value:data.back.audio.value.split(",")[1]},function(error){
														if(!error){
															data.back.dataToCreate.text = data.back.audio.name;
															data.back.dataToCreate.audio = true;
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
											if(data.back.audio.value == ''){
												cicle1(j);
											}else{

												AnswerCourse.create(data.back.dataToCreate).exec(function(error, anser){
													if (!error) {
														res.json({
															error: false,
															content: ['Tu respuesta se ha enviado']
														});
														tools.sendNotificationPush('Te han respondido en el curso '+data.front.course.name, [data.front.oneSignalID], ip+'/Course/Private/'+data.front.period.value);

														sails.sockets.broadcast("students","refreshMsgChat",{ period: data.front.period.value });
														sails.sockets.broadcast("teachers","refreshMsgChat",{ period: data.front.period.value });
													}else{
														res.json({
															error:true,
															content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
														});
													}
												});
											}
										}
									}
									catch(error){
										console.log("PCourseController > register_answer > Upload and create answer > 1: "+error);
										res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
									}
								}
							};
						}


					}
				});
			}catch(error){
				console.log("CourseController > register_answer > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	payment_answer: function(req,res,next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user){
					if (!error) {
						data.session = user;
						Management.find().exec(function(error, manage){
							if (!error) {
								data.back.manage=manage[0];
								if (data.back.manage.coinsAnswer<=data.session.coins) {

									data.back.dataToCreate={
										student: data.session.id,
										answer: data.front.idAnswer,
										coins: data.back.manage.coinsAnswer,
										status: true
									};
									PaymentAnswer.create(data.back.dataToCreate).exec(function(error, answer){
										if (!error) {
											data.session.coins-=data.back.manage.coinsAnswer;
											data.session.save(function(error){
												if (!error) {
													res.json({
														error: false,
														content: ['Pago exitoso, ya puedes ver esta respuesta']
													});
													sails.sockets.broadcast("students","refreshMsgChat",{ period: data.front.period.value });
													sails.sockets.broadcast("teachers","refreshMsgChat",{ period: data.front.period.value });
												}else{
													res.json({
														error:true,
														content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
													});
												}
											});
										}else{
											res.json({
												error:true,
												content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
											});
										}
									});


								}else{
									res.json({
										error:true,
										content:["Lo sentimos, no tienes suficientes monedas para procesar la transaccion"]
									});
								}
							}
						});

					}
				});
			}catch(error){
				console.log("CourseController > register_answer > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	payment_login: function(req, res,next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId, function(error, user){
					if (!error) {
						data.back.user=user;
						Search(data);
					}
				});
				function Search(data){
					try{
						Management.find().exec(function(error, manage){
							if (!error) {
								data.back.manage=manage[0];
								Course.find({id: data.front.course}).populate("type").exec(function(error, course){
									if (!error) {
										data.back.course=course[0];
										updateCoins(data);
									}
								});
							}
						});
					}catch(error){
						console.log("Error CourseController -> search -> 1: "+error);
					}
				}
				function updateCoins(data){
					var coins=data.back.manage.coinsHour*data.back.course.type.hours;
					data.back.user.coins+=coins;
					data.back.user.save(function(error){
						if (!error) {
							res.json({
								error: false,
								content: ['Pago realizado']
							});
						}else{
							res.json({
								error:true,
								content:["Lo sentimos, no tienes suficientes monedas para procesar la transaccion"]
							});
						}
					});
				}
			}catch(error){
				console.log("CourseController > payment_login > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	erollment_course: function(req, res, next){
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
						CoursePeriod.find({id: data.front.idPeriod , state:'active', status: true}).populate('course').populate('teacher').populate('schedule').exec(function(error, period){
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
														res.json({
															error: false,
															elements: data.back.course,
															course_cat: data.back.course_cat,
															user: data.back.user
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
														console.log("eooooooooooooooooooooooooooooooooooo");
														ratings();
													}
												});
											}
										});
									}
									function ratings(){
										Ratings.find({course: data.back.course.course.id, teacher: data.back.course.teacher.id}).average('number').done(function(error, average){
											console.log("dddddddddddddddddddddddddd");
											if (!error) {
												//data.back.course.rating=average;
												data.back.course.rating=0.9;
												res.json({
													error: false,
													elements: data.back.course,
													course_cat: data.back.course_cat
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
	erollment_course_register: function(req,res,next){
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
						if (data.back.user.student) {
							req.session.save(function(error){
								if(!error){
									data.back.enrollmenToCreate={
										period: data.front.course.value,
										student: data.back.user.id,
										payment_state: false,
										quantity: data.front.cupos.value,
										validate: false,
									};
									Enrollment.find({student: data.back.user.id, period: data.front.course.value}).exec(function(error, en){
										if (!error && en.length==0) {
											Enrollment.create(data.back.enrollmenToCreate).exec(function(error, enrollment){
												if(!error && enrollment){
													res.json({
														error: false,
														content: ['¡Te hemos registrado en el curso!'],
														view: '/Course/Enrollment/'+enrollment.id+'/Payment'
													});
												}else{
													res.json({
														error: true,
														content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
													});
												}
											});
										}else{
											res.json({error:true,content:["Ya estas inscrito en este curso, no puedes volver a inscribirte"]});
										}
									});

								}else{
									res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
								}
							});
						}else{
							console.log("adminaaaaaaa");
							res.json({error:true,content:["No eres estudiante en bloxie, No puedes inscribirte en este curso"]});
						}

					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPublicController -> home: "+error);
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
	find_types_files: function(req, res, next) {
		// body...
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						TypeFile.find({status:true}).exec(function(error, types) {
							// body...
							if (!error) {
								res.json({
									error: false,
									elements: types,
								});
							}else{
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						})
					}
				});
			}catch(error){
				console.log("Error CourseController -> find_types_files: "+error);
			}
		}
	},
	upload_file_course: function (req, res, next) {
		// body...
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.back.file=data.front.file;
						data.back.dataToCreate={
							url:'',
							name: data.front.file.name,
							course: data.front.course,
							extension: data.front.file.extension,
							icon: data.front.file.icon,
							size: data.front.file.size,
							status: true
						};
						uploadfile(data);
						function uploadfile(data){
							try{
								cicle1(0);
								function cicle1(i){
									data.back.file.name_generate = "/files/course/"+tools.generateRandomCode(50)+"."+data.back.file.extension;
									tools.existFile({name:data.back.file.name_generate},function(exist){
										if(!exist){
											tools.uploadFile({name:data.back.file.name_generate,value:data.back.file.value.split(",")[1]},function(error){
												if(!error){
													data.back.dataToCreate.url = data.back.file.name_generate;
													save_file(data);
												}else{
													res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
												}
											});
										}else{
											cicle1(i);
										}
									});
								}		//}
								function save_file(data){
									FileCourse.create(data.back.dataToCreate).exec(function(error, file){
										if(!error){
											FilePeriod.create({period: data.front.period, file: file.id, active: true, status:true}).exec(function(error, filep){
												if (!error) {
													res.json({
															error: false,
															content: ['Se ha guardado el archivo']
														});
														sails.sockets.broadcast("students","refreshFilesPeriod");
														sails.sockets.broadcast("teachers","refreshFilesPeriod");
												}else{
													res.json({
														error: true,
														content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
													});
												}
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
							catch(error){
								console.log("CourseController > upload_file_course > 3: "+error);
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						}
					}
				});
			}catch(error){
				console.log("Error CourseController -> upload_file_course: "+error);
			}
		}
	},
	find_files_period: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.back.user=user;
						FilePeriod.find({period: data.front.idPeriod, active: true,status: true}).populate('file').sort('createdAt DESC').exec(function(error, files){
							if (!error) {
								res.json({
									error: false,
									elements: files,
								});

							}else{
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						});
					}
				});
			}catch(error){
				console.log("Error CourseController -> upload_file_course: "+error);
			}
		}
	},
	ratingCourse : function(req,res,next){
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
						if(data.session.student){
							validateCourse(data);
						}
					}else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
				});
			}catch(error){
				console.log("CourseController > ratingCourse > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}

			function validateCourse(data){
				try{
					CoursePeriod.find({id:data.front.periodId}).populate("course").populate("teacher").exec(function(error,period){
						if(!error && period.length > 0){
							data.back.period = period[0];
							validateData(data);
						}
					});
				}catch(error){
					console.log("CourseController > ratingCourse > 1: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function validateData(data){
				try{
					var fields = [{
						id : data.front.comment.id,
						value : data.front.comment.value,
						required : true,
						minLength : 1,
						maxLength : 2000,
						sting : true
					}];
					tools.validateData({fields:fields},function(error){
						if(!error){
							if(data.front.rating.value != 0 && data.front.rating.value <= 5){
								createRating(data);
							}else{
								res.json({error:true,content:["Debes calificar la calidad del curso dando click en una de las estrellas"]});
							}
						}else{
							res.json({error:error.error,fieldId:error.fieldId,content:error.content});
						}
					});
				}catch(error){
					console.log("CourseController > ratingCourse > 2: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

			function createRating(data){
				try{
					data.back.ratingToCreate = {
						period : data.back.period.id,
						course : data.back.period.course.id,
						student: data.session.id,
						number : data.front.rating.value,
						comment : data.front.comment.value,
						teacher: data.back.period.teacher.id,
					};
					Ratings.create(data.back.ratingToCreate).exec(function(error,rating){
						if(!error && rating){
							data.back.rating = rating;
							var email=data.back.period.teacher.email;
							var name=data.back.period.teacher.name;
							var slug=data.back.period.id;
							var course=data.back.period.course.name;

							var email={
								from: 'Bloxie',
								to: email,
								body: 'Hola, '+name+'. <br>Un usuario  a calificado el curso <a style="color:rgba(63,80,119,1);font-weight:bolder" href="'+ip+'/Course/Private/'+slug+'">'+course+'</a> en base a tu servicio en el envío  \n Revisa su opinión sobre el curso!',
								title: 'Han calificado el curso '+course,
								subject: 'Un usuario ha calificado el curso '+course,
								href:ip+'/Course/Private/'+slug,
								nameButton: 'Ver Opinión!',
								footer: 'Cordialmente, <br> Equipo Bloxie.',
							}
							tools.sendEmail(email, function(error){
								if (!error) {
								}
							});
							res.json({
								error : false,
								cleanFields : true,
								content : ["Haz calificado el curso "+course+" con exito!"]
							});
							tools.sendNotificationPush('Te han califcado en el curso '+data.back.period.course.name, [data.back.period.teacher.oneSignalID], ip+'/Course/Private/'+data.back.period.id);
							sails.sockets.broadcast(data.session.id,"refreshCourse");

							/*sails.sockets.broadcast(data.back.rating.company,"closeShipmentSelected",{shipment:data.back.shipment,error:false,content:["El envío ha finalizado","Este envío pasará a un estado de Finalizado"]});
							var notification = {
								content : "Un cliente ha dado por finalizado el envío "+data.back.shipment.name+".",
								href : "/Shipments/Finished/"+data.back.shipment.slug
							};
							sails.sockets.broadcast(data.back.rating.company,"notification",notification);*/
						}
					});
				}catch(error){
					console.log("CourseController > ratingCourse > 1: "+error);
					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
				}
			}

		}
	},
	cursos_del_mes: function(req, res,next){
		if(req.isSocket){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				data.back.date= new Date();
				data.back.perod = {}
				data.back.course = {}
				CoursePeriod.find({
					or: [
					{date_init:{
						'>': new Date(data.back.date.getFullYear(), data.back.date.getMonth(), 1),
						'<': new Date(data.back.date.getFullYear(), data.back.date.getMonth() + 1, 0, 23, 59, 59)
					}},
					{date_finish:{
						'>': new Date(data.back.date.getFullYear(), data.back.date.getMonth(), 1),
						'<': new Date(data.back.date.getFullYear(), data.back.date.getMonth() + 1, 0, 23, 59, 59)
					}}]
				}).populate("course").populate("teacher").populate("schedule").exec(function(error, period){
					if (!error) {
						if (period.length>0) {
							data.back.perod=period;
							var findCatsC = function (course,endResult) {

								var courseObj = {
									course: {},
									categories: {}
								}
								CategoryCourse.find({course:course.course.id}).populate("category").exec(function(error, categories){
										if (!error && categories.length>0) {

											courseObj.course = course;
											courseObj.categories = categories
											return endResult(null,courseObj)

										}
								});
						 	};
							async.map(data.back.perod, findCatsC, function iterador(err,results){
					          	return res.json({
									error: false,
									elements: results
								});
					        });
						}else{
							res.json({
								error:false,
								elements:[]
							});
						}
					}else{
						res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
					}
				});
			}catch(error){
				console.log("Error CourseController -> cursos_del_mes: "+error);
			}
		}
	},
	payment_mercado: function(req, res, next) {
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						if(data.session.student){
							validateEnrrollment(data);
						}
					}else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
					function validateEnrrollment(data) {
						Enrollment.find({id:data.front.enrollment, period: data.front.period, student: data.session.id}).exec(function(error, enrollment){
							if (!error && enrollment.length>0) {
								data.back.enrollment=enrollment[0];
								var doPayment = mp.post ("/v1/payments",
									{
										"transaction_amount": data.front.amount,
										"token": data.front.token,
										"description": "Pago de inscripción en curso "+data.front.course_name,
										"installments": 1,
										"payment_method_id": data.front.type_tdc,
										"payer": {
											"email": data.front.email
										}
									}
								);
								doPayment.then (
									function (payment) {
										console.log (payment);
										console.log("Status: "+payment.response.status);
										if (payment.response.status=='approved') {
											Payment.create({reference: payment.response.id, total: data.front.amount}, function(error, pay){
												if (!error) {
													data.back.enrollment.payment=pay.id;
													console.log(pay);
													console.log(pay.id);
													data.back.enrollment.payment_state=true;
													data.back.enrollment.validate=true;
													data.back.enrollment.save(function(error){
														if (!error) {
															Search(data);
														}
													});
												}
											});
										}else if(payment.response.status=='rejected'){
											res.json({error:true,content:["Pago rechazado. Revise la información proporcionada"]});
										}
									},
									function (error){
										console.log (error);
										res.json({error:true,content:["Se ha producido un error con el pago","Por favor intentalo más tarde"]});
									}
								);
								function Search(data){
									try{
										Management.find().exec(function(error, manage){
											if (!error) {
												data.back.manage=manage[0];
												Course.find({id: data.front.course}).populate("type").exec(function(error, course){
													if (!error) {
														data.back.course=course[0];
														updateCoins(data);
													}
												});
											}
										});
									}catch(error){
										console.log("Error CourseController -> search -> 1: "+error);
									}
								}
								function updateCoins(data){
									var coins=data.back.manage.coinsHour*data.back.course.type.hours;
									data.session.coins+=coins;
									data.session.save(function(error){
										if (!error) {
											console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP");

											res.json({
												error: false,
												content: ['Pago realizado']
											});
										}else{
											res.json({
												error:true,
												content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]
											});
										}
									});
								}
							}else{
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						});
					}
				});
			}catch(error){
				console.log("CourseController > payment_mercado > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}
	},
	send_invitation: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						if(data.session.student){
							validateEnrrollment(data);
						}
					}else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
					function validateEnrrollment(data) {
						Enrollment.find({id: data.front.idEnrrollment, student: data.session.id}).populate("period").exec(function(error, enrollment){
							if (!error) {
								data.back.enrollment=enrollment[0];
								Course.find({id: data.back.enrollment.period.course}).populate("type").exec(function(error, course){
									if (!error && course.length>0) {
										data.back.course=course[0];
										validateEmails(0);
									}else{
										res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
									}
								});
							}else{
								res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
							}
						});
					}
					function validateEmails(i){
						User.find({email: data.front.email[i].value}).exec(function(error, user){
							if (!error && user.length>0) {
								data.back.email=user[0];
								var enrollment_create={
									student: user[0].id,
									payment: data.back.enrollment.payment,
									payment_state: data.back.enrollment.payment_state,
									amount: data.back.enrollment.amount,
									period: data.back.enrollment.period.id,
									validate: false
								};
								Enrollment.create(enrollment_create).exec(function(error, enro){
									if (!error) {
										var email={
											from: 'Bloxie School',
											to: data.back.email.email,
											body: data.back.email.name+', '+data.session.name+' te ha invitado a participar en el <strong>'+data.back.course.type.name+' de '+data.back.course.name+'</strong>  ✋ <br><br> Ingresa a Bloxie School para completar tu inscripción y disfrutar de tu '+data.back.course.type.name+'<br><br>',
											title: data.session.name+' te ha invitado a participar en el '+data.back.course.type.name+' de '+data.back.course.name,
											subject: data.session.name+' te ha invitado a participar en el '+data.back.course.type.name+' de '+data.back.course.name+' ✋',
											href:ip+'/Course/Enrollment/'+enro.id+'/Accept',
											nameButton: 'IR A LA APP',
											footer: 'Bloxie School Staff.'
										};
										tools.sendEmail(email, function(error){
											if (!error) {
												if (data.front.email[i+1]) {
													validateEmails(i+1);
												}else{
													res.json({
														error: false,
														content: ['Se ha enviado la invitacion']
													});
												}
											}else{
												res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
											}
										});
									}else{
										res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
									}
								});
							}else{
								var email={
									from: 'Bloxie School',
									to: data.front.email[i].value,
									body: 'Hola, '+data.session.name+' te ha invitado a participar en el <strong>'+data.back.course.type.name+' de '+data.back.course.name+'</strong>  ✋ <br><br> Ingresa a Bloxie School para completar tu inscripción y disfrutar de tu '+data.back.course.type.name+'<br><br>',
									title: data.session.name+' te ha invitado a participar en el '+data.back.course.type.name+' de '+data.back.course.name,
									subject: data.session.name+' te ha invitado a participar en el '+data.back.course.type.name+' de '+data.back.course.name+' ✋',
									href:ip+'/Course/Enrollment/'+data.back.enrollment.id+'/User/Accept',
									nameButton: 'IR A LA APP',
									footer: 'Bloxie School Staff.'
								};
								tools.sendEmail(email, function(error){
									if (!error) {
										if (data.front.email[i+1]) {
											validateEmails(i+1);
										}else{
											res.json({
												error: false,
												content: ['Se ha enviado la invitacion']
											});
										}
									}else{
										res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
									}
								});
							}
						})
					}
				});
			}catch(error){
				console.log("CourseController > send_invitation > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}

		}
	},
	validate_enrrolment: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						if(data.session.student){
							validateEnrrollment(data);
						}else{
							res.json({error:true,
								view: '/Dashboard',
						        content:["No eres un estudiante"]});
						}
					}else{
						req.session.destroy(function(){
							sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});
						});
					}
					function validateEnrrollment(data) {
						console.log("data.session.id "+data.session.id);
						console.log("data.front.idEnrrollment "+data.front.idEnrrollment);
						Enrollment.find({id: data.front.idEnrrollment, student:data.session.id}).exec(function(error, enrollment){
							if (!error && enrollment.length>0) {
								data.back.enrollment=enrollment[0];
								if (data.back.enrollment.validate) {
									res.json({
										error:true,
										view: '/Dashboard',
										content:["Ya haz aceptado la invitación anteriormente"]});

								}else{
									data.back.enrollment.validate=true;
									data.back.enrollment.save(function(error){
										if(!error){
											TypeCourse.find({id: data.front.type}).exec(function(error, type){
												if (!error && type.length>0) {
													data.back.type=type[0];
													Management.find().exec(function(error, manage){
														if (!error && manage.length>0) {
															var coins=manage[0].coinsHour*data.back.type.hours;
															data.session.coins=coins;
															data.session.user.save(function(error){
																if (!error) {
																	res.json({
																		error:false,
																		view: '/Course/Private/'+data.back.enrollment.period,
																		content:["¡Tu inscripción ha sido exitosa!"]});
																}else{
																	res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
																}
															});
														}else{
															res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
														}
													});
												}else{
													res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
												}
											});
										}else{
											res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
										}
									});
								}
							}else{
								res.json({error:true,
									view: '/Dashboard',
							        content:["Esta invitación no ha sido para ti."]});
							}
						});
					}
				});
			}catch(error){
				console.log("CourseController > validate_enrrolment > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
		}else{

		}
	},
	register_student_enrrollment: function(req, res, next){
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
							 		data.back.user=user;
							 		req.session.settings = {};
									req.session.authenticated = true;
									req.session.userId = user.id;
									Enrollment.find({id: data.front.enrollment}).exec(function(error, enrrollment){
										if (!error && enrrollment.length>0) {
											var enrollment_create={
												student: req.session.userId,
												payment: enrrollment[0].payment,
												payment_state: enrrollment[0].payment_state,
												amount: enrrollment[0].amount,
												period: enrrollment[0].period,
												validate: true
											};
											Enrollment.create(enrollment_create).exec(function(error, enro){
												if (!error) {
													TypeCourse.find({id: data.front.type}).exec(function(error, type){
														if (!error && type.length>0) {
															data.back.type=type[0];
															Management.find().exec(function(error, manage){
																if (!error && manage.length>0) {
																	var coins=manage[0].coinsHour*data.back.type.hours;
																	data.back.user.coins=coins;
																	data.back.user.save(function(error){
																		if (!error) {
																			req.session.save(function(error){
																				if(!error){
																					res.json({
																						error: false,
																						content: ['Te haz inscrito exitosamente, procede a completar tu perfil'],
																						view: '/Register/Student/Categories'
																					});
																				}else{
																					res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
																				}
																			});
																		}else{
																			res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
																		}
																	});
																}else{
																	res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
																}
															});

														}else{
															res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
														}
													});

												}else{
													res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
												}
											});
										}else{
											res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
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
	validate_enrrolment_login: function(req, res, next){
		if(req.isSocket){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				searchUser(data);
			}catch(error){
				console.log("AuthenticationController > login > 0: "+error);
				res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
			}
			function searchUser(data){
				try{
					data.front.password.value = tools.encryptCrypto("bloxie",data.front.password.value);
					User.find({email:data.front.email.value,password:data.front.password.value}).exec(function(error,users){
						if(!error){
							if(users.length > 0){
								data.back.user = users[0];
								if (data.back.user.student) {
									login(data);
								}else{
									res.json({error:true,content:["El email no pertenece a un estudiante de bloxie"]});
								}
							}else{
								User.find({userName:data.front.email.value,password:data.front.password.value}).exec(function(error,users){
									if(!error){
										if(users.length > 0){
											data.back.user = users[0];
											if (data.back.user.student) {
												login(data);
											}else{
												res.json({error:true,content:["El email no pertenece a un estudiante de bloxie"]});
											}
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
							Enrollment.find({id: data.front.enrollment}).exec(function(error, enrrollment){
								if (!error && enrrollment.length>0) {
									data.back.enrollment=enrrollment[0];
									TypeCourse.find({id: data.front.type}).exec(function(error, type){
										if (!error && type.length>0) {
											data.back.type=type[0];
											Management.find().exec(function(error, manage){
												if (!error && manage.length>0) {
													var coins=manage[0].coinsHour*data.back.type.hours;
													data.back.user.coins+=coins;
													data.back.user.save(function(error){
														if (!error) {
															req.session.save(function(error){
																if(!error){
																	data.back.enrollment.validate=true;
																	data.back.enrollment.save(function(error){
																		if (!error) {
																			res.json({
																				error: false,
																				content: ['Tu inscripción ha sido exitosa!'],
																				view: '/Course/Private/'+data.back.enrollment.period
																			});
																		}else{
																			res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
																		}
																	});

																}else{
																	res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
																}
															});
														}else{
															res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
														}
													});
												}else{
													res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
												}
											});

										}else{
											res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
										}
									});
								}else{
									res.json({error:true,content:["Lo sentimos, hemos tenido un problema en el servidor","Por favor intentalo más tarde"]});
								}
							});
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
