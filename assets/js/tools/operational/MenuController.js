app.controller("menu",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("menu",$scope);

	$scope.data = {
		open : false,
		openMenu : function(){
			$('div.sideNavMenuContainer').removeClass('hideMenuContainer')
			$scope.data.open = true;
			console.log($scope.data.user)
			
		},
		closeMenu : function(){
			$('div.sideNavMenuContainer').addClass('hideMenuContainer')
			$timeout(function(){
				$('div.sideNavMenuContainer').removeClass('showMenuContainer')
				$scope.data.open = false;
				
			},100,true);
			
		},
		user: null,
		titleNavigation: ""
	};

}]);