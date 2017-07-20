/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings of sites
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools")
module.exports = {
	search_settings: function(req, res, next) {
		// body...
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back:{},
					session:{}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						Management.find().exec(function(error, manage){
							if (!error) {
								res.json({
									error: false,
									elements: manage[0]
								});
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});		
							}
						})
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}catch(error){
				console.log("Error SettingsController -> search_settings -> 1: "+error);	
			}
		}
	},
	save_coins: function(req, res, next){
		if (req.isSocket && req.session.authenticated) {
			try{
				var data={
					front: req.params.all(),
					back:{},
					session:{}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if (!error) {
						data.back.dataToSave={
							coinsQuestion: data.front.coinsQuestion.value,
							coinsAnswer: data.front.coinsAnswer.value,
							coinsHour: data.front.coinsHour.value,
						};
						Management.update({id: data.front.id}, data.back.dataToSave).exec(function(error, manage){
							if (!error) {
								res.json({
									error: false,
									content: ['Se ha actualizado la información']
								});
							}else{
								res.json({
									error: true,
									content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
								});
							}
						});
					}else{
						res.json({
							error: true,
							content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
						});
					}
				});
			}catch(error){
				console.log("Error SettingsController -> save_coins -> 1: "+error);	
			}
		}	
	},
}
