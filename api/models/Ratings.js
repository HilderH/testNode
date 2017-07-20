/**
 * Ratings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		number : {
			type : "integer"
		},
		comment : {
			type : "string"
		},
		period : {
			model : "courseperiod"
		},
		student : {
			model : "user"
		},
		course : {
			model : "course"
		},
		teacher: {
			model:"user"
		}
	}
};

