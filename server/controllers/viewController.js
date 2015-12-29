var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var config = require('./../config/config');
var UserSettings = require('./../models/UserSettings');
var emoticonService = require('./../services/emoticonService');

module.exports.index = function (req, res) {
	var userId = _.isString(req.session.userId) ? req.session.userId.toObjectId() : req.session.userId;

	Promise.join(
		emoticonService.getEmoticonNamesFromDisk(),
		UserSettings.findOne({user: userId}),
		fs.readdirAsync('./assets/bundled').catch(_.noop)
	)
		.spread(function (emoticons, settings, bundledFiles) {
			var templates = _.find(bundledFiles, function (file) {
				return _.includes(file, 'templates');
			});

			//no template caching for dev
			if (!config.useJavascriptBundle) {
				templates = null;
			}

			res.render(config.useJavascriptBundle ? 'index-prod' : 'index', {
				templates: templates,
				userId: userId,
				useJavascriptBundle: config.useJavascriptBundle,
				emoticons: emoticons,
				loadingEmote: emoticonService.getLoadScreenEmoticon(),
				debugging: settings.showDebugging
			});
		})
		.catch(res.serverError);
};

module.exports.index2 = function (req, res) {
	var userId = _.isString(req.session.userId) ? req.session.userId.toObjectId() : req.session.userId;
	emoticonService.getEmoticonNamesFromDisk()
		.then(function (emoticons) {
			res.render('index2', {
				userId: userId,
				emoticons: emoticons
			});
		})
		.catch(res.serverError);
};

module.exports.login = function (req, res) {
	res.render('login', {
		clientID: config.google.clientID
	});
};

module.exports.logout = function (req, res) {
	req.session.destroy();
	res.redirect('/login');
};
