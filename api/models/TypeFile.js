/**
 * TypeFile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports={
	attributes:{
		name:{
			type: "string"
		},
		mimetype: {
			type: 'string'
		},
		extension:{
			type: 'string'
		},
		icon:{
			type: "string"
		},
 		status: {
 			type: "boolean"
 		}
	}
};