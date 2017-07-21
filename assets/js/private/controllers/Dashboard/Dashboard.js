app.controller("dashboard",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("dashboard",$scope);

	$scope.data = {
		back: {},
		front:{
			loader: true,
			get:{
				shows: {
					submit: function(){
						io.socket.get('/Dashboard', function(data){
							$scope.data.front.loader = false;
							if (data) {
								$scope.data.front.shows.elements = data.data.shows;
							}
							$scope.$digest();
						});
					}
				}

			},
			actions:{
				addFavorite: function(show){
					$scope.data.front.loader = true;
					dataSend = {
						user: $scope.data.front.user.id,
						idShow: show.id,
						fav: true

					}
					io.socket.post('/save/favorite',dataSend, function(data){
						if (!data.error) {
							$scope.data.front.get.shows.submit();
							scopes.get("reportMessage").data.reportMessage(data);
						}else{
							scopes.get("reportMessage").data.reportMessage(data);
						}
					});
					$scope.$digest();
				},
				removeFavorite: function(show){
					console.log(show);
				}

			},
			user: null,
			shows:{
				elements: []
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
