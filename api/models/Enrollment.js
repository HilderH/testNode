/**
 * Enrollment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports={
 	attributes:{
 		period:{
 			model: "courseperiod"
 		},
 		student:{
 			model: "user"
 		},
 		payment_state: {
 			type: "boolean"
 		},
 		type_payment:{
 			type: "string" //tdc, dep
 		},
 		quantity: {
 			type: "integer"
 		},
 		emails: {
 			type: "array"
 		},
 		amount:{
 			type: "float"
 		},
 		payment: {
 			model:"payment"
 		},
 		validate: {
 			type: "boolean"
 		}
 	}
 };