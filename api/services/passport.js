var passport = require("passport"),
	facebookStrategy = require("passport-facebook").Strategy;

passport.use(new facebookStrategy({
		clientID: "1686510731605692",
		clientSecret: "8a0ee967e50c3f88a0671ba5237ebfa3",
		callbackURL: "/Authentication/Facebook/Callback",
		profileFields: ["id","emails","name"]
	},function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			return done(null,profile);
		});
	})
);