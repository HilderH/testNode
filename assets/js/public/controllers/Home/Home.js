app.controller("home",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("home",$scope);

	$scope.data={
		back: {},
		front: {
			form: {
				active: false,
				fields:{
					email: {
						id: generateRandomCode(25),
						value: null,
						required: true,
						active: false,
					},
					password: {
						id: generateRandomCode(25),
						value: null,
						required: true,
						active: false,
					}
				},
				submit: function(){
					$scope.data.front.form.active=true;
					var fields=[];
					fields.push({
						id: $scope.data.front.form.fields.email.id,
						value: $scope.data.front.form.fields.email.value,
						email: true,
						required: true,
					});
					fields.push({
						id: $scope.data.front.form.fields.password.id,
						value: $scope.data.front.form.fields.password.value,
						string: true,
						required: true,
					});
					validateData({fields:fields},function(error){

						if(!error){
							var enviar={
								email:{
									id: $scope.data.front.form.fields.email.id,
									value: $scope.data.front.form.fields.email.value,
								},
								password: {
									id: $scope.data.front.form.fields.password.id,
									value: $scope.data.front.form.fields.password.value,
								},
							};

							io.socket.get("/Authentication/Login",enviar,function(data){
								$scope.data.front.form.active = false;
								if(data.error){
									if(data.fieldId){
										$("html,body").animate({scrollTop:$("#"+data.fieldId).offset().top-300+"px"});
										$("#"+data.fieldId).addClass("shadowInError");
									}
								}else{
									window.location = data.view;
									if(data.cleanFields){
										$scope.data.front.form.fields.email.value = "";
										$scope.data.front.form.fields.password.value = "";
									}
								}
								scopes.get("reportMessage").data.reportMessage(data);
								$scope.$digest();
							});
						}else{
							$scope.data.front.form.active=false;
							$("input, div, textarea").removeClass("shadowInError");
							$("html,body").animate({scrollTop:$("#"+error.fieldId).offset().top-300+"px"});
							$("#"+error.fieldId).addClass("shadowInError");
							scopes.get("reportMessage").data.reportMessage(error);
						}
					});
				}
			}
		},
	};
	$timeout(function(){

	},0,false);
}]);
