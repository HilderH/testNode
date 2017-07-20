app.controller("router",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("router",$scope);

	$scope.data = {
		views : {
			dashboard : {
				active : false,
				href : "/Dashboard"
			}

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
					io.socket.get('/Dashboard', function(data){


						if (data) {
							console.log(data.data);
							scopes.get("dashboard").data.front.user=data.data.user;
							scopes.get("dashboard").data.front.shows.elements = data.data.shows;
							scopes.get('dashboard').$digest();
						}else{
							window.location=data.view;
						}
						$scope.$digest();
					});
				},0,false);

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
	page();
}]);
