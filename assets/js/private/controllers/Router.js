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
						scopes.get("dashboard").data.front.loader = false;

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
	page();
}]);
