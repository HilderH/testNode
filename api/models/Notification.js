/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports={
 	attributes:{
 		user: {
 			model: "user"
 		},
 		content: {
 			type: "string"
 		},
 		href: {
 			type: "string"
 		},
 		read: {
 			type: "boolean"
 		},
 		status: {
 			type: "boolean"
 		}
 	}
 };