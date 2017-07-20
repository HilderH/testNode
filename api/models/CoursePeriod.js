/**
 * CoursePeriod.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports={
	attributes:{
		address:{
 			type: "string"
 		},
 		date_init:{
 			type: "date"
 		},
 		date_finish:{
 			type: "date"
 		},
 		days: {
 			type:'integer'
 		},
 		cost: {
 			type: "float"
 		},
 		teacher:{
 			model: "user"
 		},
 		course:{
 			model: "course"
 		},
 		enrollments:{
 			collection: "enrollment",
 			via: "period"
 		},
 		schedule:{
 			collection: "schedule",
 			via: "period"
 		},
 		status:{
 			type: "boolean"
 		},
 		//state: active, progress, feedback ,finish
 		state: {
 			type: "string",
 		}
	}
};