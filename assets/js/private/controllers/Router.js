app.controller("router",["$scope","scopes","$timeout",function($scope,scopes,$timeout){
	
	scopes.store("router",$scope);

	$scope.data = {
		views : {
			dashboard : {
				active : false,
				href : "/Dashboard"
			},
			teacher_register_profile:{
				active: false,
				href: "/Register/Teacher/Profile"
			},
			student_register_category: {
				active: false,
			},
			teacher_my_profile:{
				active: false,
				href: "/Teacher/MyProfile"
			},
			student_my_profile:{
				active: false,
				href: "/Student/MyProfile"
			},
			my_profile:{
				active: false,
				href: "/MyProfile"
			},
			
			register_course:{
				active: false,
				href: "/Register/Course"
			},
			activate_course:{
				active: false,
				href: "/Course/Activate/:idCourse"
			},
			payment_course: {
				active: false,
				href:"/Course/Enrollment/:idEnrollment/Payment"
			},
			enrollment_course: {
				active: false,
				href:"/Course/Private/Enrollment/:idPeriod"
			},
			course:{
				active: false,
				href:'/Course/:idPeriod'
			},
			invitation: {
				active: false,
				href:"/Course/Enrollment/:idEnrollment/Invitation"
			},
			accept_invitation: {
				active: false,
				href:"/Course/Enrollment/:idEnrollment/Accept"
			},

		},
		actualView : "",
		disableAllViews : function(){
			for(var i in $scope.data.views){
				$scope.data.views[i].active = "";
			}
		},
		permissions : {},
		disableAllPermissions : function(){}
	};

	$timeout(function(){
		$(".notificationMessagesContainer").css({
			display : "block"
		});
	},0,false);

	io.socket.post("/Sockets/Start",function(){
		io.socket.on("notification",function(data){
			scopes.get("notifications").data.displayMessage(data);
		});
	});
	page('/Register/Teacher/Profile', function(data){
		if ("/Register/Teacher/Profile" != $scope.data.actualView){
			$scope.data.actualView = "/Register/Teacher/Profile";
			$scope.data.disableAllViews();
			$scope.data.views.teacher_register_profile.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#teacher_register_profile").css({
						display : "block"
					});
					$(document).scrollTop(0);
					
				},0,false);
				io.socket.get('/Register/Teacher/Profile', function(data){
					$scope.$digest();
					scopes.get("registerTeacherProfile").data.front.get.categories.submit();
					scopes.get("registerTeacherProfile").data.front.get.types.submit();
					scopes.get('registerTeacherProfile').$digest();
				});
			},0,false);
		}
	});
	page('/Register/Student/Categories', function(data){
		if ("/Register/Student/Categories" != $scope.data.actualView){
			$scope.data.actualView = "/Register/Student/Categories";
			$scope.data.disableAllViews();
			$scope.data.views.student_register_category.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#student_register_category").css({
						display : "block"
					});
					$(document).scrollTop(0);
					
				},0,false);
				io.socket.get('/Register/Student/Categories', function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Selecciona tus áreas de interés";
					scopes.get("menu").$digest();
					
					$scope.$digest();
					scopes.get("studentRegisterCategory").data.front.get.categories.submit();
					scopes.get('studentRegisterCategory').$digest();
				});
			},0,false);
		}
	});
	page('/Teacher/MyProfile', function(data){
		if ("/Teacher/MyProfile" != $scope.data.actualView){
			$scope.data.actualView = "/Teacher/MyProfile";
			$scope.data.disableAllViews();
			$scope.data.views.teacher_my_profile.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#teacher_my_profile").css({
						display : "block"
					});
					$(document).scrollTop(0);
					
				},0,false);
				io.socket.get('/Teacher/MyProfile', function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Llena tu perfil";
					scopes.get("menu").$digest();
					
					scopes.get("teacherProfile").data.front.user=data.user.id;
					scopes.get("teacherProfile").data.front.form.fields.name.value=data.user.name;
					scopes.get("teacherProfile").data.front.form.fields.lastname.value=data.user.lastname;
					scopes.get('teacherProfile').$digest();
					$scope.$digest();
				});
			},0,false);
		}
	});
	page('/Student/MyProfile', function(data){
		if ("/Student/MyProfile" != $scope.data.actualView){
			$scope.data.actualView = "/Student/MyProfile";
			$scope.data.disableAllViews();
			$scope.data.views.student_my_profile.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#student_my_profile").css({
						display : "block"
					});
					$(document).scrollTop(0);
					
				},0,false);
				io.socket.get('/Student/MyProfile', function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Llena tu perfil";
					scopes.get("menu").$digest();
					
					scopes.get("studentProfile").data.front.user=data.user.id;
					scopes.get("studentProfile").data.front.form.fields.name.value=data.user.name;
					scopes.get("studentProfile").data.front.form.fields.lastname.value=data.user.lastname;
					scopes.get('studentProfile').$digest();
				
					$scope.$digest();
				});
			},0,false);
		}
	});
	page('/Dashboard', function(data){
		if ("/Dashboard" != $scope.data.actualView){
			$scope.data.actualView = "/Dashboard";
			$scope.data.disableAllViews();
			$scope.data.views.dashboard.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#dashboard").css({
						display : "block"
					});
					$(document).scrollTop(0);
				io.socket.get('/Dashboard', function(data){

					$scope.$digest();
					if (!data.redirect) {
						scopes.get("dashboard").data.front.user=data.user;
						scopes.get("menu").data.user=data.user;
						scopes.get("menu").data.titleNavigation="Dashboard";
						scopes.get("menu").$digest();
						scopes.get("dashboard").data.front.get.onesignal.submit();
						if (data.user.admin) {
							scopes.get("dashboard").data.front.get.courses.submit();
							scopes.get("dashboard").data.front.get.settings.submit();
							scopes.get("dashboard").data.front.get.courses_admin_actives.submit();
							scopes.get("dashboard").data.front.get.courses_progress_admin.submit();		
							scopes.get("dashboard").data.front.get.courses_finish_admin.submit();
						}
						if (data.user.student){
							scopes.get("dashboard").data.front.get.courses_student.submit();
							scopes.get("dashboard").data.front.get.courses_interes.submit();	
							scopes.get("dashboard").data.front.get.courses_actives.submit();
						}
						if (data.user.teacher) {
							scopes.get("dashboard").data.front.get.courses_finish_teacher.submit();
							scopes.get("dashboard").data.front.get.courses_active_teacher.submit();	
							scopes.get("dashboard").data.front.get.courses_progress_teacher.submit();
						}
						scopes.get('dashboard').$digest();
					}else{
						window.location=data.view;
					}
				});	
				},0,false);
				
			},0,false);
		}
	});
/*	page('/', function(data){
		if ("/" != $scope.data.actualView){
			$scope.data.actualView = "/";
			$scope.data.disableAllViews();
			//$scope.data.views.dashboard.active = true;
			$timeout(function(){
				$scope.$digest();
				window.location='/Dashboard'
			},0,false);
		}
	});*/
	page('/Register/Course', function(data){
		if ("/Register/Course" != $scope.data.actualView){
			$scope.data.actualView = "/Register/Course";
			$scope.data.disableAllViews();
			$scope.data.views.register_course.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#register_course").css({
						display : "block"
					});
					$(document).scrollTop(0);
					
				},0,false);
				io.socket.get('/Register/Course', function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Registrar Curso";
					scopes.get("menu").$digest();
					
					$scope.$digest();
					scopes.get("registerCourse").data.front.user=data.user;
					scopes.get("registerCourse").data.front.get.categories.submit();
					scopes.get("registerCourse").data.front.get.types.submit();
					scopes.get('registerCourse').$digest();
				});
			},0,false);
		}
	});
	page('/Course/Activate/:idCourse', function(data){
		if ("/Course/Activate/:idCourse" != $scope.data.actualView){
			$scope.data.actualView = "/Course/Activate/:idCourse";
			$scope.data.disableAllViews();
			$scope.data.views.activate_course.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#activate_course").css({
						display : "block"
					});
					$(document).scrollTop(0);
				},0,false);
				io.socket.get('/Course/Activate/'+data.params.idCourse, function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Activar Curso";
					scopes.get("menu").$digest();
					
					$scope.$digest();
					scopes.get("activateCourse").data.front.user=data.user;
					scopes.get("activateCourse").data.front.course=data.course;
					scopes.get("activateCourse").data.front.get.teacher.submit();
					scopes.get('activateCourse').$digest();
				});
			},0,false);
		}
	});
	page('/Course/Enrollment/:idEnrollment/Payment', function(data){
		if ("/Course/Enrollment/:idEnrollment/Payment" != $scope.data.actualView){
			$scope.data.actualView = "/Course/Enrollment/:idEnrollment/Payment";
			$scope.data.disableAllViews();
			$scope.data.views.payment_course.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#payment_course").css({
						display : "block"
					});
					$(document).scrollTop(0);
				},0,false);
				io.socket.get('/Course/Enrollment/'+data.params.idEnrollment+'/Payment', function(data){
					Mercadopago.setPublishableKey("TEST-2cb4beaf-67fb-4205-925a-89e5e8ba6585");
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Paga el curso";
					scopes.get("menu").$digest();
					scopes.get("paymentEnrollment").data.front.enrollment=data.enrollment;
					scopes.get("paymentEnrollment").data.front.get.total.submit();
					scopes.get("paymentEnrollment").$digest();
				});
			},0,false);
		}
	});
	page("/Course/Private/:idPeriod",function(data){
		if("/Course/Private/:idPeriod" != $scope.data.actualView){
			$scope.data.actualView = "/Course/Private/:idPeriod";
			$scope.data.disableAllViews();
			$scope.data.views.course.active = true;
			$timeout(function(){
				$scope.$digest();
				$("#course").css({
					display : "block"
				});
				var period = data.params.idPeriod;
				io.socket.get("/Course/Private/"+data.params.idPeriod,function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Detalle del curso";
					scopes.get("menu").$digest();
					scopes.get("courseDetailPrivate").data.front.user = data.user;
					scopes.get("courseDetailPrivate").data.front.get.detail.submit(period);
					scopes.get("courseDetailPrivate").data.front.get.type_files.submit();
					scopes.get("courseDetailPrivate").data.front.width = $( window ).width();
					scopes.get("courseDetailPrivate").$digest();
					//if (data.user.teacher) {
						scopes.get("courseDetailPrivate").data.front.get.files_period.submit(period);	
					//}
					$scope.$digest();
				});

			},0,false);
		}
	});
	page("/Course/Private/Enrollment/:idPeriod",function(data){
		if("/Course/Private/Enrollment/:idPeriod" != $scope.data.actualView){
			$scope.data.actualView = "/Course/Private/Enrollment/:idPeriod";
			$scope.data.disableAllViews();
			$scope.data.views.enrollment_course.active = true;
			$timeout(function(){
				$scope.$digest();
				$("#course").css({
					display : "block"
				});
				var period = data.params.idPeriod;
				io.socket.get("/Course/Private/Enrollment/"+data.params.idPeriod,function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Adquirir un curso";
					scopes.get("menu").$digest();
					scopes.get("courseEnrollmentPrivate").data.front.user = data.user;
					scopes.get("courseEnrollmentPrivate").data.front.get.enrollmentCourse.submit(data);
					scopes.get("courseEnrollmentPrivate").data.front.width = $( window ).width();
					scopes.get("courseEnrollmentPrivate").$digest();
					$scope.$digest();
				});

			},0,false);
		}
	});
	page('/Course/Enrollment/:idEnrollment/Invitation', function(data){
		if ("/Course/Enrollment/:idEnrollment/Invitation" != $scope.data.actualView){
			$scope.data.actualView = "/Course/Enrollment/:idEnrollment/Invitation";
			$scope.data.disableAllViews();
			$scope.data.views.invitation.active = true;
			$timeout(function(){
				$scope.$digest();
				$("#invitation").css({
						display : "block"
					});
				$(document).scrollTop(0);
				$scope.$digest();
				io.socket.get('/Course/Enrollment/'+data.params.idEnrollment+'/Invitation', function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Invitar al curso";
					scopes.get("menu").$digest();
					
					$scope.$digest();
					console.log(data.enrollment);
					scopes.get("invitationEnrollment").data.front.enrollment=data.enrollment;
					scopes.get("invitationEnrollment").data.front.user=data.user;
					scopes.get("invitationEnrollment").data.front.get.categories_course.submit();
					scopes.get("invitationEnrollment").$digest();
				});
			},0,false);
		}
	});
	page('/MyProfile', function(data){
		if ("/MyProfile" != $scope.data.actualView){
			$scope.data.actualView = "/MyProfile";
			$scope.data.disableAllViews();
			$scope.data.views.my_profile.active = true;
			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#my_profile").css({
						display : "block"
					});
				io.socket.get('/MyProfile', function(data){
					scopes.get("menu").data.user=data.user
					scopes.get("menu").data.titleNavigation="Mi Perfil"
					
					scopes.get("myProfile").data.front.width=screen.width;
					scopes.get("myProfile").data.front.user=data.user;
					scopes.get("myProfile").data.front.get.categories.submit();
					scopes.get("myProfile").data.front.get.categories_all.submit();
					scopes.get('myProfile').$digest();
					$scope.$digest();
					
					$timeout(function(){
						scopes.get("myProfile").data.front.image();
					},2000,false);
					$(document).scrollTop(0);
					
				},0,false);
				
				});
			},0,false);
		}
	});
	page('/Course/Enrollment/:idEnrollment/Accept', function(data){
		if ("/Course/Enrollment/:idEnrollment/Accept" != $scope.data.actualView){
			$scope.data.actualView = "/Course/Enrollment/:idEnrollment/Accept";
			$scope.data.disableAllViews();
			$scope.data.views.accept_invitation.active = true;
			$timeout(function(){
				$scope.$digest();
				$("#accept_invitation").css({
					display : "block"
				});
				$(document).scrollTop(0);
				$scope.$digest();
				io.socket.get('/Course/Enrollment/'+data.params.idEnrollment+'/Accept', function(data){
					scopes.get("menu").data.user=data.user;
					scopes.get("menu").data.titleNavigation="Aceptar invitación al curso";
					scopes.get("menu").$digest();
					
					$scope.$digest();
					console.log(data.enrollment);
					scopes.get("acceptInvitation").data.front.enrollment=data.enrollment;
					scopes.get("acceptInvitation").data.front.user=data.user;
					scopes.get("acceptInvitation").data.front.get.categories_course.submit();
					scopes.get("acceptInvitation").$digest();
				});
			},0,false);
		}
	});
	
	page();
}]);