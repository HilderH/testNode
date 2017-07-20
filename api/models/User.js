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
		name: {
			type: "string"
		},
		lastname:{
			type: "string"
		},
 		status: {
 			type: "boolean"
 		},

 		/**********STUDENT CATEGORIES****************/
 		fav_user:{
 			collection: "favorite",
			via: "user"
 		}
	}
};
