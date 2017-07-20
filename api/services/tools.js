var crypto = require("crypto"),
	fs = require("fs"),
	nodemailer = require("nodemailer"),
	is = require("is_js");

module.exports = {
	//USERS
	validateUser : function (userId,cb){
		searchUser();
		function searchUser(){
			try{
				User.findOneById(userId).exec(function(error,user){
					if(!error && user){
						if(user.student){
							console.log("student");
							cb(false,user);
						}else if(user.teacher){
							cb(false,user);
						}else{
							cb(false,user);
						}
					}else{
						cb(true);
					}
				});
			}catch(error){
				cb(true);
			}
		}
	},
	//GENERAL
	existFile : function (file,cb){
		fs.exists(__dirname.replace('\\api','').replace('/api','').replace('\\services','').replace('/services','')+'/.tmp/public'+file.name,function(exist){
			if(exist){
				cb(true);
			}else{
				cb(false);
			}
		});
	},
	deleteFile : function (file,cb){
		fs.exists(__dirname.replace('\\api','').replace('/api','').replace('\\services','').replace('/services','')+'/.tmp/public'+file.name,function(exist){
			if(exist){
				fs.unlink(__dirname.replace('\\api','').replace('/api','').replace('\\services','').replace('/services','')+'/.tmp/public'+file.name,function(error){
					if(!error){
						cb(false);
					}else{
						cb(true);
					}
				});
			}else{
				cb(false);
			}
		});
	},
	uploadFile : function (file,cb){
		var serverRoot = __dirname.replace('\\api','').replace('/api','').replace('\\services','').replace('/services','')+'/.tmp/public'+file.name;
		var base64Data = new Buffer(file.value,"base64");
		
		fs.writeFile(serverRoot,base64Data,function(error){
			if(!error){
				cb(false);
			}else{
				console.log(error);
				cb(true);
			}
		});
	},
	generateRandomNumber : function (length){
		var numbers = "0123456789";
		var character = "";
		var code = "";
		character += numbers;
		for(var i=0; i < length; i++){
			code += character.charAt(getRandomNumber(0, character.length));
		}
		function getRandomNumber(lowerBound,upperBound){ 
			random = Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
			return random;
		}
		return code;
	},
	generateRandomCode : function (length){
		var numbers = "0123456789";
		var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
		var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var character = "";
		var code = "";
		character += numbers;
		character += lowercaseLetters;
		character += uppercaseLetters;
		for(var i=0; i < length; i++){
			code += character.charAt(getRandomNumber(0, character.length));
		}
		function getRandomNumber(lowerBound,upperBound){ 
			random = Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
			return random;
		}
		return code;
	},
	
	encryptCrypto : function (key,element){
		var cipher = crypto.createCipher("aes256",key);
		var elementEncrypt = cipher.update(element,'utf-8','hex')+cipher.final('hex');
		return elementEncrypt;
	},
	decryptCrypto : function (key,element){
		var decipher = crypto.createDecipher("aes256",key);
		var elementDecrypt = decipher.update(element,'hex','utf-8')+decipher.final('utf-8');
		return elementDecrypt;
	},
	validateData : function(data,cb){
		var dataError = {};
		cicle1(0);
		function cicle1(i){
			if(data.fields[i].required){
				if(_.isEqual(data.fields[i].value,"") || _.isUndefined(data.fields[i].value) || _.isNull(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["El campo seleccionado es requerido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].minLength && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(data.fields[i].value.length < data.fields[i].minLength){
					dataError.error = true;
					dataError.content = ["La longitud mínima de caracteres de este campo debe ser mayor a "+data.fields[i].minLength];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].maxLength && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(data.fields[i].value.length > data.fields[i].maxLength){
					dataError.error = true;
					dataError.content = ["La longitud máxima de caracteres de este campo debe ser menor a "+data.fields[i].maxLength];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].string && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!_.isString(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].numeric && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!is.number(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].integer && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!is.integer(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].url && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!is.url(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].checkbox){
				var numberOfChecked = 0;
				for(var j in data.fields[i].value){
					if(data.fields[i].value[j].value){
						numberOfChecked++;
					}
				}
				if(data.fields[i].checkbox.minChecked){
					if(numberOfChecked < data.fields[i].checkbox.minChecked){
						dataError.error = true;
						dataError.content = ["Debes escoger al menos ("+data.fields[i].checkbox.minChecked+") opción(es)"];
						dataError.fieldId = data.fields[i].id;
						cb(dataError);
						return;
					}
				}
				if(data.fields[i].checkbox.maxChecked){
					if(numberOfChecked > data.fields[i].checkbox.maxChecked){
						dataError.error = true;
						dataError.content = ["El máximo de opciones que puedes elegir son "+data.fields[i].checkbox.maxChecked];
						dataError.fieldId = data.fields[i].id;
						cb(dataError);
						return;
					}
				}
				if(data.fields[i].checkbox.enum){
					var exist = false;
					for(var j in data.fields[i].value){
						if(_.indexOf(data.fields[i].checkbox.enum,j) != -1){
							exist = true;
						}
					}
					if(!exist){
						dataError.error = true;
						dataError.content = ["Error en formato de campo","Porfavor recarga la página e intentalo de nuevo"];
						dataError.fieldId = data.fields[i].id;
						cb(dataError);
						return;
					}
				}
			}

			if(data.fields[i].date && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!is.date(new Date(data.fields[i].value))){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}else if(data.fields[i].lessThan){
					var lessThan = new Date(data.fields[i].lessThan);
					data.fields[i].value = new Date(data.fields[i].value);
					if(data.fields[i].value >= lessThan){
						dataError.error = true;
						dataError.content = ["La fecha de inicio debe ser menor que la fecha de cierre"];
						dataError.fieldId = data.fields[i].id;
						cb(dataError);
						return;
					}
				}else if(data.fields[i].greatherThan){
					var greatherThan = new Date(data.fields[i].greatherThan);
					data.fields[i].value = new Date(data.fields[i].value);
					if(data.fields[i].value >= greatherThan){
						dataError.error = true;
						dataError.content = ["La fecha de cierre debe ser mayor que la fecha de inicio"];
						dataError.fieldId = data.fields[i].id;
						cb(dataError);
						return;
					}
				}
			}

			if(data.fields[i].alphadashed && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!/^[a-zA-ZÑñÀ-ú ]+$/.test(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].email && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].boolean && !_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value) ){
				if(!is.boolean(data.fields[i].value)){
					dataError.error = true;
					dataError.content = ["Este campo posee un formato inválido"];
					dataError.fieldId = data.fields[i].id;
					cb(dataError);
					return;
				}
			}

			if(data.fields[i].enum){
				if(!is.array(data.fields[i].value)){
					if((!_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value)) || (data.fields[i].required)){
						if(_.indexOf(data.fields[i].enum,data.fields[i].value) == -1){
							dataError.error = true;
							dataError.content = ["Debes seleccionar al menos una opción"];
							dataError.fieldId = data.fields[i].id;
							cb(dataError);
							return;
						}
					}
				}else{
					if((data.fields[i].value.length > 0 || (data.fields[i].required))){
						var exist = false;
						_.times(data.fields[i].value.length,function(index){
							if(_.indexOf(data.fields[i].enum,data.fields[i].value[index]) != -1){
								exist = true;
							}
						});
						if(!exist){
							dataError.error = true;
							dataError.content = ["Debes seleccionar al menos una opción"];
							dataError.fieldId = data.fields[i].id;
							cb(dataError);
							return;
						}
					}
				}
			}

			if(data.fields[i].image){
				if((!_.isEqual(data.fields[i].value,"") && !_.isUndefined(data.fields[i].value) && !_.isNull(data.fields[i].value)) || data.fields[i].image.required){
					if(data.fields[i].size/200000 < 1){
						if(data.fields[i].value.substring(data.fields[i].value.indexOf(":")+1,data.fields[i].value.indexOf("/")) == "image"){
							if(data.fields[i].value.substring(data.fields[i].value.indexOf("/")+1,data.fields[i].value.indexOf(";")) == "jpg" || data.fields[i].value.substring(data.fields[i].value.indexOf("/")+1,data.fields[i].value.indexOf(";")) == "jpeg" || data.fields[i].value.substring(data.fields[i].value.indexOf("/")+1,data.fields[i].value.indexOf(";")) == "png"){
								if(data.fields[i].value.substring(data.fields[i].value.indexOf(",")+1) == ""){
									dataError.error = true;
									dataError.content = ["La imágen que intenta colocar posee un formato inválido"];
									dataError.fieldId = data.fields[i].id;
									cb(dataError);
									return;
								}
							}else{
								dataError.error = true;
								dataError.content = ["La imágen que intenta colocar posee un formato inválido"];
								dataError.fieldId = data.fields[i].id;
								cb(dataError);
								return;
							}
						}else{
							dataError.error = true;
							dataError.content = ["La imágen que intenta colocar posee un formato inválido"];
							dataError.fieldId = data.fields[i].id;
							cb(dataError);
							return;
						}	
					}else{
						dataError.error = true;
						dataError.content = ["La imágen que intenta colocar es muy pesada"];
						dataError.fieldId = data.fields[i].id;
						cb(dataError);
						return;
					}
				}
			}

			if(data.fields[i].unique){
				sails.models[data.fields[i].model].find(JSON.parse('{"'+data.fields[i].name+'":"'+data.fields[i].value+'"}')).exec(function(error,elements){
					if(!error){
						if(elements.length > 0){
							if(data.fields[i].method == "post"){
								dataError.error = true;
								dataError.content = ["Ya esta en uso este dato"];
								dataError.fieldId = data.fields[i].id;
								cb(dataError);
								return;
							}else if(data.fields[i].method == "put"){
								if(data.fields[i].value != data.fields[i].actualValue){
									dataError.error = true;
									dataError.content = ["Ya esta en uso este dato"];
									dataError.fieldId = data.fields[i].id;
									cb(dataError);
									return;
								}else{
									i++;
									if(data.fields[i]){
										cicle1(i);
									}else{
										cb(false);
									}
								}
							}
							
						}else{
							i++;
							if(data.fields[i]){
								cicle1(i);
							}else{
								cb(false);
							}
						}
					}
				});
			}else{
				i++;
				if(data.fields[i]){
					cicle1(i);
				}else{
					cb(false);
				}
			}
		}
	},
	generateBodyEmail : function (body,title,href,nameButton, footer){
		var HTML=
		"<div style='width:100%; heigth:100%;'>"
	//HEADER
			+"<div style='padding: 7px 10px;'>"
				+"<img src='http://i.imgur.com/CWm8GqS.png' width='200px' style='float:left;'/>"
				+"<div style='padding:22px 20px 5px 20px;font-size:17px;color:rgb(0, 120, 191);float:left;'>"+title+"</div>"
			+"</div>"
			+"<div style='border-bottom:2px solid #022268; clear:both;'></div>"
			+"<div style='padding:30px 1% 10px 1%;font-size:17px;'>"
				+body
			+"</div>"
			+"<div style='padding:30px 1% 10px'>"
				+"<a href='"+href+"' style='padding: 8px 25px; background:#3C1053; color:white; text-decoration:none; font-size:18px;border-radius:5px;' title='"+nameButton+"'>"+nameButton+"</a>"
			+"</div>"
			+"<div style='margin-top: 20px; padding:30px 1% 10px;'>"+footer+"</div>"
				//FOOTER
			+"<div style='background:#3C1053;padding:2px 0px 1px 0px;color:white;font-size:16px;text-align:center;'>"
				+"<div>"
					+"<span style='color:white;font-size:10px;'>"
						+"COPYRIGHT 2016 <a href='' style='text-decoration:none;color:white;'>Bloxie</a> - TODOS LOS DERECHOS RESERVADOS"
					+"</span>"
				+"</div>"
			+"</div>"
		+"</div>";
		return HTML;
	},
	sendEmail : function (data,cb){
		var transport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user:'info@cargomercado.com',
				pass:'12pvdicargomercado34',
			}
		});

		//GENERAR HTML CORREO ELECTRONICO
		var HTML = this.generateBodyEmail(data.body, data.title, data.href, data.nameButton, data.footer);
		
		//CONFIGURACION DEL CORREO ELECTRONIC0
		var mailOptions = {
			from: 'Bloxie <info@bloxie.com>',
			to: data.to,
			subject: data.subject,
			html: HTML
		};

		//ENVIAR CORREO ELECTRONICO
		transport.sendMail(mailOptions,function(error,response){
			if(error){
				console.log("Error al enviar un correo electrónico: "+error);
				cb(true);
			}else{
				cb(false);
			}
		});
	},
	sendEmailSinBoton : function (data,cb){
		var transport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user:'info@cargomercado.com',
				pass:'12pvdicargomercado34',
			}
		});

		//GENERAR HTML CORREO ELECTRONICO
		var HTML = this.generateBodyEmailSinBoton(data.body, data.title, data.footer);
		
		//CONFIGURACION DEL CORREO ELECTRONIC0
		var mailOptions = {
			from: 'Bloxie <info@bloxie.com>',
			to: data.to,
			subject: data.subject,
			html: HTML
		};

		//ENVIAR CORREO ELECTRONICO
		transport.sendMail(mailOptions,function(error,response){
			if(error){
				console.log("Error al enviar un correo electrónico: "+error);
				cb(true);
			}else{
				cb(false);
			}
		});
	},
	generateBodyEmailSinBoton : function (body,title,footer){
		var HTML=
		"<div style='width:100%; heigth:100%;'>"
	//HEADER
			+"<div style='padding: 7px 10px;'>"
				+"<img src='http://i.imgur.com/CWm8GqS.png' width='200px' style='float:left;'/>"
				+"<div style='padding:22px 20px 5px 20px;font-size:17px;color:rgb(0, 120, 191);float:left;'>"+title+"</div>"
			+"</div>"
			+"<div style='border-bottom:2px solid #022268; clear:both;'></div>"
			+"<div style='padding:30px 1% 10px 1%;font-size:17px;'>"
				+body
			+"</div>"
			+"<div style='margin-top: 20px; padding:30px 1% 10px;'>"+footer+"</div>"
				//FOOTER
			+"<div style='background:rgb(0, 120, 191);padding:2px 0px 1px 0px;color:white;font-size:16px;text-align:center;'>"
				+"<div>"
					+"<span style='color:white;font-size:10px;'>"
						+"COPYRIGHT 2016 <a href='' style='text-decoration:none;color:white;'>VIVEDOG</a> - TODOS LOS DERECHOS RESERVADOS"
					+"</span>"
				+"</div>"
			+"</div>"
		+"</div>";
		return HTML;
	},
	
	sendNotificationPush: function(msg, users, url){
		var sendNotification = function(data) {
		  var headers = {
		    "Content-Type": "application/json; charset=utf-8",
		    "Authorization": "Basic OTg0ZDQyMjAtM2EyMC00Y2NmLTgxNDQtNWU0Yjk3Zjk0OTY5"
		 // 	   "Authorization": "Basic YjkxNDFlYzktMTY2NS00YTVmLWEyMjQtZDEwMGE2NTQ5ZWVj"
		 
		  };
		  
		  var options = {
		    host: "onesignal.com",
		    port: 443,
		    path: "/api/v1/notifications",
		    method: "POST",
		    headers: headers
		  };
		  
		  var https = require('https');
		  var req = https.request(options, function(res) {  
		    res.on('data', function(data) {
		      console.log("Response:");
		      console.log(JSON.parse(data));
		    });
		  });
		  
		  req.on('error', function(e) {
		    console.log("ERROR:");
		    console.log(e);
		  });
		  
		  req.write(JSON.stringify(data));
		  req.end();
		};

		var message = { 
		  //app_id:"c62c51e9-153b-4050-bcd7-5d1e63d927a4",
		  app_id: "b1bccc89-eba6-4f9a-bddc-0234ad692752",
		  contents: {"en": msg},
		  include_player_ids: users,
		  url: url
		};

		sendNotification(message);

	}
}