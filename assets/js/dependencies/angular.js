var app = angular.module("app",['ngSanitize','ngMaterial', 'angularTrix','ngMaterialDatePicker']);

app.factory("scopes",[function(){
	var scopes = [];

	return {
		store : function(scope,value){
			scopes[scope] = value;
		},
		get : function(scope){
			return scopes[scope];
		}
	};
}]);
