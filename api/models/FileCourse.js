/**
 * FileCourse.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports={
	attributes:{
		name:{
			type: "string"
		},
		extension: {
			type: "string"
		},
		url: {
			type: "string"
		},
		course:{
			model: 'course'
		},
		icon: {
			type: "string"
		},
		size: {
			type: "float"
		},
 		status: {
 			type: "boolean"
 		}
	}
};