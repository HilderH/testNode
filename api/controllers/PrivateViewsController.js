/**
 * PrivateViewsController
 *
 * @description :: Server-side logic for managing private views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tools = require("../services/tools");
var request = require('request');
var rp = require('request-promise');
module.exports = {

	dashboard: function(req, res, next){
		if(!req.isSocket && req.session.authenticated){
			var data = {
				front : req.params.all(),
				back : {},
				session : {}
			};
			res.view("private/index");
		}else if(req.isSocket && req.session.authenticated){
			try{
				var data = {
					front : req.params.all(),
					back : {},
					session : {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.back.user = data.session;
						var options = {
						    uri: 'http://api.tvmaze.com/shows',
						    headers: {
						        'User-Agent': 'Request-Promise'
						    },
								resolveWithFullResponse: true,
						    json: true
						};
						var shows;
						rp(options).then(function (repos) {
								if (repos.statusCode == 200) {
									data.back.shows = repos.body
									// res.json({
									// 	error: false,
									// 	data: data.back
									// });
									validateFavorites(data.back);



								}
				    }).catch(function (err) {
				        // API call failed...
				    });


					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			}catch(error){
				console.log("Error ViewPrivateController -> home: "+error);
			}
			function validateFavorites(data){
				allShows = data.shows
				try{
					var findFavorites = function (show,endResult) {
						Favorite.findOne( {show: show.id} ).exec(function (error, obj){
							if (obj && !error) {
								show.favorite = obj.fav;
								return endResult(null,show)
							}else{
								return endResult(null,show)
							}

						});
					}
					async.map(allShows, findFavorites, function iterador(err,results){
						data.shows = results
						res.json({
							error: false,
							data: data
						});

					});
				}catch(error){
					req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
				}
			}
		}
	},
	save_favorite: function(req, res, next){
		if(req.isSocket && req.session.authenticated){
			try{
				var data={
					front: req.params.all(),
					back: {},
					session: {}
				};
				tools.validateUser(req.session.userId,function(error,user){
					if(!error && user){
						data.session = user;
						data.session.settings = req.session.settings;

						data.back.dataToCreate={
							user: user.id,
							show: data.front.idShow,
							fav: data.front.fav,
							status: true
						};
						Favorite.findOne( {where: {show: data.back.dataToCreate.show}} ).exec(function (err, show){
							if (!err) {
								if (!show) {
									Favorite.create(data.back.dataToCreate).exec(function(error, show){
										if(!error && show){
											res.json({
												error: false,
												content: ['Show guardado como favorito.']
											});
										}else{
											res.json({
												error: true,
												content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
											});
										}
									});
								}else{
									if ( show.fav ) {
										Favorite.update({show: data.back.dataToCreate.show}, {fav: false}).exec(function afterwards(error, sho){
											if (!error) {
												res.json({
														error: false,
														content: ['Haz quitado este show de tus favoritos.']
													});
											}else{
												res.json({
													error: true,
													content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
												});
											}
										});
									}else{
										Favorite.update({show: data.back.dataToCreate.show}, {fav: true}).exec(function afterwards(error, sho){
											if (!error) {
												res.json({
														error: false,
														content: ['Haz quitado este show de tus favoritos.']
													});
											}else{
												res.json({
													error: true,
													content: ['Hemos tenido un problema en el servidor, por favor intente más tarde.']
												});
											}
										});
									}

								}

							}
						})


					}else{
						req.session.destroy(function(){sails.sockets.broadcast(req.socket.id,"redirect",{direction:"/"});});
					}
				});
			} catch(error){
				console.log("Error PrivateController -> add/RemoveFav: "+error);

			}
		}

	}

};
