var config = module.exports;

config.environment = 'production-beta';
config.isProduction = true;
config.url = 'http://bunkerchat.net:443';

config.db = {
	host: 'localhost',
	name: 'bunker',
	session: 'bunker_sessions',
	port: '27017'
};

config.express = {
	hostName: 'localhost',
	port: 9002,
	ip: '0.0.0.0'
};

config.google = {
	clientID: process.env.google_clientID,
	clientSecret: process.env.google_clientSecret
};

config.consoleLogLevel = 'info';
config.cacheLess = true;
config.useJavascriptBundle = true;
