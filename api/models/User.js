/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports={
	attributes: {
		username:{
			type: "string"
		},
		password:{
			type: "string"
		},
		email:{
			type: "string"
		},
		
		cedula:{
			type: "string"
		},
		rif:{
			type: "string"
		},
		name: {
			type: "string"
		},
		lastname:{
			type: "string"
		},
		birthdate:{
			type: "date"
		},
		address:{
			type: "string"
		},
		phone:{
			type: "string"
		},
		photo:{
			type:"string"
		},
		comentary:{
			type: "string"
		},
		coins: {
			type: "integer"
		},
 		status: {
 			type: "boolean"
 		},
 		oneSignalID: {
 			type: "string"
 		},

 		/**********STUDENT CATEGORIES****************/
 		categories_student:{
 			collection: "categorystudent",
			via: "student"	
 		},
		/****TEACHER CATEGORIES****/
		categories_teacher:{
			collection: "categoryteacher",
			via: "teacher"
		},
		type_teacher:{
			model: "typeteacher"
		},
		/***********ROLES**********/
		student:{
			type: "boolean"
		},
		teacher:{
			type: "boolean"
		},
		admin:{
			type: "boolean"
		},
	}
};