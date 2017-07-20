/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports={
 	attributes:{
 		name:{
 			type: "string"
 		},
 		description:{
 			type: "string"
 		},
 		picture:{
 			type: "string"
 		},
 		question_student:{
 			type: "string"
 		},
 		question_addressed:{
 			type: "string"
 		},
 		methodology:{
 			type: "string"
 		},
 		recommendations:{
 			type: "string"
 		},
 		type: {
 			model:"typecourse"
 		},
 		categories: {
 			collection: "categorycourse",
 			via: "course"
 		}
 	}
 };