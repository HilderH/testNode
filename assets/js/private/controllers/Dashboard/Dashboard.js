app.controller("dashboard",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("dashboard",$scope);

	$scope.data = {
		back: {},
		front:{
			get:{
				courses: {
					submit: function(){
						io.socket.get("/Find/Courses", function(data){

							if (!data.error) {
								$scope.data.front.courses.elements=data.elements;
								$scope.$digest();
							}
						})
					}
				},
				courses_student: {
					submit: function(){
						io.socket.get("/Find/Courses/student/enrollment", function(data){
							if (!data.error) {
								$scope.data.front.courses.elements=data.elements;
								console.log(data.elements[2]);
								$scope.$digest();
							}
						})
					}
				},
				courses_active_teacher:{
					submit: function(){
						console.log("ffff");
						io.socket.get("/Find/Corses/Active/Teacher", function(data){
							if (!data.error) {
								$scope.data.front.courses_active_teacher.elements=data.elements;
								console.log("da: "+data.elements.length);
								//$scope.data.front.get.courses_finish_teacher.submit();
								$scope.$digest();
							}else{
								console.log("qqffff");
							}
						});
					}
				},
				courses_progress_teacher:{
					submit: function(){
						io.socket.get("/Find/Courses/teacher/progress", function(data){
							if (!data.error) {
								$scope.data.front.courses_progress_teacher.elements=data.elements;
								console.log("da: "+data.elements.length);
								$scope.$digest();
							}
						});
					}
				},
				courses_finish_teacher:{
					submit: function(){
						io.socket.get("/Find/Courses/Finish", function(data){
							if (!data.error) {
								$scope.data.front.courses_finish_teacher.elements=data.elements;
								console.log("da: "+data.elements.length);
								$scope.$digest();
							}
						});
					}
				},
				
				courses_interes: {
					submit: function(){
						console.log("dd");
						io.socket.get("/Find/Courses/student/category", function(data){
							if (!data.error) {
								console.log("resp: "+data.elements);
								$scope.data.front.courses_interes_student.elements=data.elements;
								$scope.$digest();
							}
						})
					}
				},
				courses_actives: {
					submit: function(){
						io.socket.get("/Find/Courses/student/active", function(data){
							if (!data.error) {
								console.log("resp: "+data.elements);
								$scope.data.front.courses_active.elements=data.elements;
								$scope.$digest();
							}
						});
					}
				},
				courses_admin_actives: {
					submit: function(){
						io.socket.get("/Find/Courses/admin/active", function(data){
							if (!data.error) {
								console.log("resp: "+data.elements);
								$scope.data.front.courses_admin_active.elements=data.elements;
								$scope.$digest();
							}
						});
					}
				},
				courses_progress_admin:{
					submit: function(){
						io.socket.get("/Find/Courses/admin/progress", function(data){
							if (!data.error) {
								$scope.data.front.courses_progress_admin.elements=data.elements;
								console.log("da: "+data.elements.length);
								$scope.$digest();
							}
						});
					}
				},
				courses_finish_admin:{
					submit: function(){
						io.socket.get("/Find/Courses/admin/finish", function(data){
							if (!data.error) {
								$scope.data.front.courses_finish_admin.elements=data.elements;
								console.log("da: "+data.elements.length);
								$scope.$digest();
							}
						});
					}
				},
				settings: {
					submit: function(){
						io.socket.get('/Find/Settings', function(data){
							if (!data.error) {
								$scope.data.front.settings.element=data.elements;
								$scope.$digest();
							}
						});
					}
				},
				onesignal:{
					submit: function(){
						OneSignal.push(function() {
					  /* These examples are all valid */
					      OneSignal.getUserId(function(userId) {
					        console.log("OneSignal User ID:", userId);
					        // (Output) OneSignal User ID: 270a35cd-4dda-4b3f-b04e-41d7463a2316    
					      	io.socket.post('/Set/IdOnesignal', {onesignal: userId}, function(data){
					      		if (!data.error) {
					      		}
					      	});
					      });
					    });
					}
				}
				
			},
			actions:{
				openMenu: function($mdMenu, ev){
					var originatorEv;
					originatorEv = ev;
      				$mdMenu.open(ev);
				}

			},
			user: null,
			courses:{
				elements: []
			},
			courses_active_teacher:{
				elements:[]
			},
			courses_progress_teacher:{
				elements:[]
			},
			courses_finish_teacher:{
				elements:[]
			},
			courses_interes_student:{
				elements:[]
			},
			courses_active:{
				elements:[]
			},
			courses_admin_active:{
				elements:[]
			},
			courses_progress_admin:{
				elements:[]
			},
			courses_finish_admin:{
				elements:[]
			},
			settings:{
				element: null,
				edit: false,
				form:{
					fields:{
						coinsQuestion: {
							id: generateRandomCode(25),
							value: 0
						},
						coinsAnswer:{
							id: generateRandomCode(25),
							value: 0
						},
						coinsHour: {
							id: generateRandomCode(25),
							value: 0
						},
					},
					edit: function(){
						$scope.data.front.settings.edit=true;
						$scope.data.front.settings.form.fields.coinsQuestion.value=$scope.data.front.settings.element.coinsQuestion;
						$scope.data.front.settings.form.fields.coinsAnswer.value=$scope.data.front.settings.element.coinsAnswer;
						$scope.data.front.settings.form.fields.coinsHour.value=$scope.data.front.settings.element.coinsHour;
					},
					dataToSend: function(){
						var data = {};
						for(var i in $scope.data.front.settings.form.fields){
							data[i] = {
								id : $scope.data.front.settings.form.fields[i].id,
								value : $scope.data.front.settings.form.fields[i].value
							};
						}
						data.id=$scope.data.front.settings.element.id;
						return data;
					},
					submit: function(){
						var fields=[];
						fields.push({
							id: $scope.data.front.settings.form.fields.coinsQuestion.id,
							value: $scope.data.front.settings.form.fields.coinsQuestion.value,
							required: true,
						});
						fields.push({
							id: $scope.data.front.settings.form.fields.coinsAnswer.id,
							value: $scope.data.front.settings.form.fields.coinsAnswer.value,
							required: true,
						});
						fields.push({
							id: $scope.data.front.settings.form.fields.coinsHour.id,
							value: $scope.data.front.settings.form.fields.coinsHour.value,
							required: true,
						});
						validateData({fields:fields},function(error){
							if(!error){
								io.socket.post('/Save/Coins',$scope.data.front.settings.form.dataToSend(), function(data){
									if (!data.error) {
										$scope.data.front.settings.edit=false;
										$scope.data.front.get.settings.submit();
										scopes.get("reportMessage").data.reportMessage(data);
									}else{
										scopes.get("reportMessage").data.reportMessage(data);
									}
								});
							}else{
								$("input, div, textarea").removeClass("shadowInError");
								$("html,body").animate({scrollTop:$("#"+error.fieldId).offset().top-300+"px"});
								$("#"+error.fieldId).addClass("shadowInError");
								scopes.get("reportMessage").data.reportMessage(error);
							}
						});
					}
				}
			},
			redirect: function(url){
				window.location=url;
			}
		},
	};
	$timeout(function(){
		io.socket.on("refreshCoursesList",function(data){
			if("/Dashboard" == scopes.get("router").data.actualView){
				if ($scope.data.front.user.admin) {
						$scope.data.front.get.courses.submit();
						$scope.data.front.get.settings.submit();
					}
					if ($scope.data.front.user.student){
						$scope.data.front.get.courses_student.submit();
						$scope.data.front.get.courses_interes.submit();	
						$scope.data.front.get.courses_actives.submit();
					}
					if ($scope.data.front.user.teacher) {
						$scope.data.front.get.courses_active_teacher.submit();	
						scopes.get("dashboard").data.front.get.courses_progress_teacher.submit();		
					}
					
				$scope.$digest();
			}
		});
	},0,false);
}]);