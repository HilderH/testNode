/**
 * 	AnswerCourse.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports={
 	attributes:{
 		question:{
 			model:"questioncourse"
 		},
 		text:{
 			type: "string"
 		},
		payout: {
			type: "boolean"
		},
		audio: {
 			type: "boolean"
 		},
 		status: {
 			type: "boolean"
 		}
 	}
 };
