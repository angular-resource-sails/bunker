var Session = require('express-session');
var MongoStore = require('connect-mongo')(Session);
var passport = require('passport');
var GooglePlusStrategy = require('passport-google-plus');
var LocalStrategy = require('passport-local').Strategy;
var url = require('url');

//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var config = require('./config');
var userService = require('./../services/userService');
var User = require('./../models/User');

var auth = module.exports;

auth.init = function (app) {

	var session = auth.session = Session({
		secret: '64ec1dff67add7c8ff0b08e0b518e43c',
		resave: false,
		saveUninitialized: true,
		collection: 'bunker_sessions',
		cookie: {
			maxAge: 120 * 24 * 60 * 60 * 1000 // ~ 4 months
		},
		store: new MongoStore({
			url: 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.session
		})
	});

	app.use(session);

	app.use(passport.initialize());
	app.use(passport.session());

	// what is this doing
	passport.serializeUser(function (user, done) {
		done(null, user._id.toString());
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id).exec(done);
	});

	passport.use(new GooglePlusStrategy({
		clientId: config.google.clientID,
		clientSecret: config.google.clientSecret,
	}, loginCallback));

	function loginCallback(tokens, profile, done) {
		userService.findOrCreateBunkerUser(profile).nodeify(done);
	}

	app.post('/auth/googleCallback',
		// mobile app requires a different redirectUri
		(req, res, next) => {
			const query = url.parse(req.url, true).query;
			let redirectUri = 'postmessage';

			if (query.client === 'mobile') {
				redirectUri = null;
			}

			passport.authenticate('google', { redirectUri })(req, res, next);
		},
		function (req, res) {
			req.session.googleCredentials = req.authInfo;
			res.json({});
		});

	passport.use(new LocalStrategy(function (username, password, done) {
		User.findOne({email: username}, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				console.log('failed login - no user', {message: 'Incorrect username.', username, password})
				return done(null, false, {message: 'Incorrect username.'});
			}
			if (user._doc.plaintextpassword != password) {
				console.log('failed login - bad password', {message: 'Incorrect username.', username, password})
				return done(null, false, {message: 'Incorrect password.'});
			}
			return done(null, user);
		});
		}
	));

	auth.authenicateLocal = passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/loginBasic'
	});

	return session;
};

