app.controller("myProfile",["$scope","scopes","$timeout",function($scope,scopes,$timeout){

	scopes.store("myProfile",$scope);

	$scope.data = {
		back: {},
		front:{
			get: {
				categories:{
					submit: function(){
						io.socket.get('/Find_Categories_User', function(data){
							console.log("ll");
							if (!data.error) {
								if ($scope.data.front.user.student) {
									$scope.data.front.user.categories_student=data.elements;
								}else if ($scope.data.front.user.teacher) {
									$scope.data.front.user.categories_teacher=data.elements;
								}
								io.socket.get('/Find/Categories', function(data){
									$scope.data.front.categories_all.elements=data.elements;
									if ($scope.data.front.user.student) {
										for(var i=0; i<$scope.data.front.user.categories_student.length; i++){
											for(var j=0; j<$scope.data.front.categories_all.elements.length; j++){

											}
										}
									}else if ($scope.data.front.user.teacher){

									}
									console.log("n: "+$scope.data.front.user.categories_student);
									$scope.$digest();
								});
							}
							$scope.$digest();
						});
					}
				},
				profile:{
					submit: function(){
						io.socket.get('/MyProfile', function(data){
							$scope.data.front.user=data.user;
							$scope.data.front.get.categories.submit();
							$scope.$digest();	
						});
					}
				},
				categories_all:{
					submit: function(){
						
					}
				}
			},
			width: null,
			user: [],
			active : false,
			categories_all:{
				elements: []
			},
			change_password: {
				form : {
					fields : {
						actualPassword : {
							id : generateRandomCode(25),
							value : "",
							maxLength : 100,
							active : false
						},
						newPassword : {
							id : generateRandomCode(25),
							value : "",
							maxLength : 100,
							active : false
						},
						newPasswordRepeat : {
							id : generateRandomCode(25),
							value : "",
							maxLength : 100,
							active : false
						}
					},
					dataToSend : function(){
						var data = {};
						for(var i in $scope.data.front.change_password.form.fields){
							data[i] = {
								id : $scope.data.front.change_password.form.fields[i].id,
								value : $scope.data.front.change_password.form.fields[i].value
							};
						}
						return data;
					},
					submit : function(){
						if(!$scope.data.front.active){
							$scope.data.front.active = true;
							$("input,textarea").blur();
							io.socket.put("/Password/Change/Update",$scope.data.front.change_password.form.dataToSend(),function(data){
								$scope.data.front.active = false;
								if(data.error){
									if(data.fieldId){
										$("html,body").animate({scrollTop:$("#"+data.fieldId).offset().top-300+"px"});
										$("#"+data.fieldId).addClass("shadowInError");
									}
								}else{
									if(data.cleanFields){
										$scope.data.front.change_password.form.fields.actualPassword.value = "";
										$scope.data.front.change_password.form.fields.newPassword.value = "";
										$scope.data.front.change_password.form.fields.newPasswordRepeat.value = "";
									}
								}
								scopes.get("reportMessage").data.reportMessage(data);
								$scope.$digest();
							});
						}
					},
				}
			},
			edit_profile:{
				edit: false,
				form: {
					fields:{
						phone: {
							id: generateRandomCode(25),
							value: '',
						},
						birthdate: {
							id: generateRandomCode(25),
							value: null,
						},
						comentary: {
							id: generateRandomCode(25),
							value: '',
						},
						photo:{
							id: generateRandomCode(25),
							value:[],
							active: false,
							edit:false,
							changeImage : function(){
								console.log("we");
								if(!$scope.data.front.edit_profile.form.fields.photo.active){
									confirmWindow({question:"¿Está seguro que desea eliminar la imágen?",confirm:"Sí",cancel:"No"},function(cancel){
										if(!cancel){
											angular.element("#"+$scope.data.front.edit_profile.form.fields.photo.id).trigger("click");
										}
									});
								}
							},
							upload : function(files){
								$scope.data.front.edit_profile.form.fields.photo.active = true;
								var fileReader = new FileReader();
								fileReader.readAsDataURL(files[0]);
								fileReader.onloadend = function(e){
									$scope.data.front.edit_profile.form.fields.photo.value[0]={
										id : generateRandomCode(25),
										value : e.target.result,
										size : files[0].size,
										remove : function(position){
											confirmWindow({question:"¿Está seguro que desea eliminar la imágen?",confirm:"Sí",cancel:"No"},function(cancel){
												if(!cancel){
													$scope.data.front.edit_profile.form.fields.photo.value.splice(position,1);
													$scope.$digest();
												}
											});
										}
									};
									$scope.$digest();
									$scope.data.front.edit_profile.form.fields.photo.active = false;			
									$scope.data.front.edit_profile.form.fields.photo.edit = true;
									/*var foto={
										photo: $scope.data.front.edit_profile.form.fields.photo.value[0],
									};
									io.socket.put('/Profile/Photo/Update',foto, function(data){
										if (!data.error) {
											$("#"+$scope.data.front.profile.photo.id).val("");
											$scope.data.front.profile.photo.active = false;
											$scope.$digest();
											$('#profile .profile-content .profile .image').height($('#profile .profile-content .profile .image').width());
										}
										scopes.get("reportMessage").data.reportMessage(data);
										scopes.get("reportMessage").$digest();
									});
									*/
								};
							}
						},
						
					},
					open: function(){
						$scope.data.front.edit_profile.form.fields.phone.value= $scope.data.front.user.phone;
						$scope.data.front.edit_profile.form.fields.birthdate.value= $scope.data.front.user.birthdate;
						console.log("edit: "+$scope.data.front.edit_profile.form.fields.birthdate.value);
						console.log("normal: "+$scope.data.front.user.birthdate);						
						$scope.data.front.edit_profile.form.fields.comentary.value= $scope.data.front.user.comentary;
							
						$scope.data.front.edit_profile.edit=true;
						$('.image-update').css("display", "block");
					},
					dataToSend: function(){
						var data = {
							phone:{
								id: $scope.data.front.edit_profile.form.fields.phone.id,
								value: $scope.data.front.edit_profile.form.fields.phone.value,
							},
							birthdate:{
								id: $scope.data.front.edit_profile.form.fields.birthdate.id,
								value: $scope.data.front.edit_profile.form.fields.birthdate.value,
							},
							comentary:{
								id: $scope.data.front.edit_profile.form.fields.comentary.id,
								value: $scope.data.front.edit_profile.form.fields.comentary.value,
							},
							edit: $scope.data.front.edit_profile.form.fields.photo.edit,
						};
						console.log("Edit foto: "+$scope.data.front.edit_profile.form.fields.photo.edit);
						if ($scope.data.front.edit_profile.form.fields.photo.edit) {
							data.photo={
								id: $scope.data.front.edit_profile.form.fields.photo.id,
								value: $scope.data.front.edit_profile.form.fields.photo.value[0]
							};
						}
						return data;
					},
					submit: function(){
						$scope.data.front.active =true;
						var fields=[];
						fields.push({
							id: $scope.data.front.edit_profile.form.fields.birthdate.id,
							value: $scope.data.front.edit_profile.form.fields.birthdate.value,
							required: true
						});
						fields.push({
							id: $scope.data.front.edit_profile.form.fields.phone.id,
							value: $scope.data.front.edit_profile.form.fields.phone.value,
							required: true
						});
						validateData({fields:fields},function(error){
							if(!error){
								io.socket.put('/Profile/Update', $scope.data.front.edit_profile.form.dataToSend(), function(data){
									if (!data.error) {
										$scope.data.front.active =false;
										$scope.data.front.edit_profile.edit=false;
										$scope.data.front.get.profile.submit();
										$scope.$digest();
										$('.image-update').css("display", "none");
					
									}
									else{
										$scope.data.front.active=true;
									}
									scopes.get("reportMessage").data.reportMessage(data);
									scopes.get("reportMessage").$digest();
								});
							}
							else{
								$("input, div, textarea").removeClass("shadowInError");
								$("html,body").animate({scrollTop:$("#"+error.fieldId).offset().top-300+"px"});
								$("#"+error.fieldId).addClass("shadowInError");
								scopes.get("reportMessage").data.reportMessage(error);
								scopes.get("reportMessage").$digest();
							}
						});
					}
				}
			},
			image: function(){
				console.log("ddasada");
				var imagen = new Image();
		        imagen.src = $scope.data.front.user.photo;
		        var canvas = document.createElement("canvas");
			    canvas.width = imagen.width;
			    canvas.height = imagen.height;

			    var ctx = canvas.getContext("2d");
			    ctx.drawImage(imagen, 0, 0);

			    var dataURL = canvas.toDataURL("image/png");
			    dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
			    $scope.data.front.edit_profile.form.fields.photo.value.push({
					id : generateRandomCode(25),
					value : dataURL,
					editado: false,
					remove : function(position){
						confirmWindow({question:"¿Está seguro que desea eliminar la imágen?",confirm:"Sí",cancel:"No"},function(cancel){
							if(!cancel){
								$scope.data.front.edit_profile.form.fields.photo.value=[];
								$scope.$digest();
							}
						});
					},

				});
			},
			logout: function(){
				window.location='/Logout';
			},
			menu: {
				open: false,
				direction: 'down',
				class: 'md-fling'
			}
		}
	},
	$timeout(function(){
	},0,false);
}]);