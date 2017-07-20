app.controller("dashboard",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("dashboard",$scope);

	$scope.data = {
		back: {},
		front:{
			get:{
				courses: {
					submit: function(){
						io.socket.get("/Dashboard", function(data){

							if (!data.error) {
								con
								$scope.data.front.courses.elements=data.elements;
								$scope.$digest();
							}
						})
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
			shows:{
				elements: []
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
