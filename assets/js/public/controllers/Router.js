app.controller("router",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("router",$scope);

	$scope.data = {
		views : {
			home : {
				active : false,
				href : "/"
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
	},0,false);
	page("/",function(data){
		if("/" != $scope.data.actualView){

			$scope.data.actualView = "/";
			$scope.data.disableAllViews();
			$scope.data.views.home.active = true;
			console.log(data);

			$timeout(function(){
				$scope.$digest();
				$timeout(function(){
					$("#home").css({
						display : "block"
					});
					$(document).scrollTop(0);

				},0,false);

				io.socket.get("/",function(data){

						$scope.$digest();
						scopes.get("home").$digest();


				});

			},0,false);
		}
		menuActions(true);

	});
	page("/Login",function(data){
		if("/Login" != $scope.data.actualView){
			$scope.data.actualView = "/Login";
			$scope.data.disableAllViews();
			$scope.data.views.login.active = true;
			$timeout(function(){
				$scope.$digest();
				$("#login").css({
					display : "block"
				});
				io.socket.get("/Login",function(data){
					$scope.$digest();
				});

			},0,false);
		}
		menuActions(true);
	});
	page();

}]);
