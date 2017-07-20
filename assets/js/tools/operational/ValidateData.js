function validateData(data,cb){
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
					if(data.fields[i].size/5000000 < 1){
						if(data.fields[i].value.substring(data.fields[i].value.indexOf(":")+1,data.fields[i].value.indexOf("/")) == "image"){
							if(data.fields[i].value.substring(data.fields[i].value.indexOf("/")+1,data.fields[i].value.indexOf(";")) == "jpg" || data.fields[i].value.substring(data.fields[i].value.indexOf("/")+1,data.fields[i].value.indexOf(";")) == "jpeg" || data.fields[i].value.substring(data.fields[i].value.indexOf("/")+1,data.fields[i].value.indexOf(";")) == "png"){
								if(data.fields[i].value.substring(data.fields[i].value.indexOf(",")+1) == ""){
									console.log("explota 1");
									dataError.error = true;
									dataError.content = ["La imágen que intenta colocar posee un formato inválido"];
									dataError.fieldId = data.fields[i].id;
									cb(dataError);
									return;
								}
							}else{
							console.log("explota 2");
								dataError.error = true;
								dataError.content = ["La imágen que intenta colocar posee un formato inválido"];
								dataError.fieldId = data.fields[i].id;
								cb(dataError);
								return;
							}
						}else{
							console.log("explota 3");
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

			if(!dataError.error){
				i++;
				if(data.fields[i]){
					cicle1(i);
				}else{
					cb(false);
				}
			}
		}
}