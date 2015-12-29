var config = require('./config');
var socketio = require('./socketio');

// Controllers
var viewController = require('../controllers/viewController');
var userController = require('../controllers/UserController');
var roomController = require('../controllers/RoomController');
var userSettingsController = require('../controllers/UserSettingsController');
var messageController = require('../controllers/MessageController');
var externalNotificationsController = require('../controllers/ExternalNotificationsController');

// Policies
var isLoggedIn = require('../policies/isLoggedIn');

module.exports.http = function (app) {

	// Public
	app.get('/login', viewController.login);
	app.get('/logout', viewController.logout);

	// Internal views
	app.get('/', isLoggedIn, viewController.index);
	app.get('/2', isLoggedIn, viewController.index2);

	// External Notifications
	app.post('/externalnotifications/jenkinsBestBuy', externalNotificationsController.jenkinsBestBuy);
	app.post('/externalnotifications/serverStatus', externalNotificationsController.serverStatus);

	// Api
	app.get('/api/message/emoticoncounts', messageController.emoticonCounts);
};

module.exports.socketio = function (socket) {
	// init
	socket.on('/init', socketToController(userController.init));

	// user
	socket.on('/user/current/activity', socketToController(userController.activity));
	socket.on('/user/current/markInboxRead', socketToController(userController.markInboxRead));
	socket.on('/user/current/clearInbox', socketToController(userController.clearInbox));

	// user settings
	socket.on('/usersettings/save', socketToController(userSettingsController.save));

	// room
	socket.on('/room', socketToController(roomController.create));
	socket.on('/room/join', socketToController(roomController.join));
	socket.on('/room/leave', socketToController(roomController.leave));
	socket.on('/room/message', socketToController(roomController.message));
	socket.on('/room/messages', socketToController(roomController.messages));
	socket.on('/room/history', socketToController(roomController.history));

	// roommember
	socket.on('/roommember/updateSettings', socketToController(userSettingsController.saveRoomMember));

	// message
	socket.on('/message/edit', socketToController(messageController.update));
	socket.on('/message/emoticoncounts', socketToController(messageController.emoticonCounts));

};

function socketToController(controllerFn) {
	return function (data, cb) {
		var req = {
			socket: this,
			io: socketio.io,
			session: this.handshake.session,
			body: data || {}
		};

		var res = {
			ok: function (returnData) {
				if(_.isFunction(cb) && returnData) cb(returnData);
			},
			serverError: function (err) {
				log.error('server error', err);
				if(_.isFunction(cb)) cb({serverErrorMessage: err.message});
			},
			badRequest: function(err) {
				if(_.isFunction(cb)) cb({serverErrorMessage: err.message});
			}
		};
		controllerFn(req, res);
	};
}
