/**
 * Schedule.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports={
 	attributes:{
 		period: {
 			model: 'courseperiod'
 		},
 		date:{
 			type: 'date'
 		},
 		hour_init:{
 			type: 'date'
 		},
 		hour_finish:{
 			type: 'date'
 		},
 		status: {
 			type: 'boolean'
 		}
 	}
 };