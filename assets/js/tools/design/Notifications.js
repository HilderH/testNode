app.controller("notifications",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("notifications",$scope);

	$scope.data = {
		messages : [],
		displayMessage : function(data){
			var message = {
				id : generateRandomCode(25),
				content : data.content,
				href : data.href
			};
			$scope.data.messages.push(message);
			setTimeout(function(){
				$scope.data.deleteMessage(message);
				$scope.$digest();
			},20000);
			$scope.$digest();
		},
		deleteMessage : function(message){
			for(var i = 0; i < $scope.data.messages.length; i++){
				if($scope.data.messages[i].id == message.id){
					$scope.data.messages.splice(i,1);
					break;
				}
			}
		}
	};

}]);