app.controller("reportMessage",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("reportMessage",$scope);

	$scope.data = {
		messages : [],
		reportMessage : function(data){
			var message = {
				id : generateRandomCode(25),
				content : data.content,
				animationClass : "fadeInFromTop",
				display : "block"
			};
			if(data.error){
				message.background = "#ff453b";
				message.classIcon = "fa fa-exclamation-circle";
				message.class= "notification-error";
			}else{
				message.background = "rgba(62,201,72,1)";
				message.class= "notification-success";
			}
			$scope.data.messages.push(message);
			$timeout(function(){
				$scope.$digest();				
			},0,false);
			setTimeout(function(){
				$scope.data.deleteMessage(message.id);
				$scope.$digest();
			},20000);
		},
		deleteMessage : function(id){
			for(var i = 0; i < $scope.data.messages.length; i++){
				if($scope.data.messages[i].id == id){
					$scope.data.messages.splice(i,1);
					break;
				}
			}
		},
		deleteMessageAll : function(){
			$scope.data.messages=[];
		}
	};

}]);