/* exported util */

var util = {
	baseUrl: function() {
		var prefix = 'https://platform.cod.uno';

		if (location.origin.indexOf('localhost') !== -1) {
			prefix = 'http://localhost:8080';
		}

		if (location.origin.indexOf('coduno-staging') !== -1) {
			prefix = 'https://platform-dot-coduno-staging.appspot.com';
		}

		return prefix;
	},
	build: function(suffix) {
		return util.baseUrl() + suffix;
	},
	getWSUrl: function(suffix) {
		var prefix = 'wss://ws.cod.uno:8080';

		if (location.origin.indexOf('localhost') !== -1) {
			prefix = 'ws://localhost:8080';
		}

		return prefix + suffix;
	},
	getSockWSUrl: function(suffix) {
		var prefix = 'https://platform.cod.uno';

		if (location.origin.indexOf('localhost') !== -1) {
			prefix = 'http://localhost:8080';
		}

		return prefix + suffix;
	},
	computeDuration: function(duration) {
		var minutes = Math.floor(duration / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var months = Math.floor(days / 30);
		if (months >= 1) {
			return months + ' months';
		}
		if (days >= 2) {
			return days + ' days';
		}
		if (hours >= 5) {
			return hours + ' hours';
		}
		return minutes + ' minutes';
	},
	error: function(error) {
		var app = document.querySelector('#app');
		if (error.detail.request.xhr.status === 401) {
			app.isLoggedIn = false;
			return page.redirect('/login');
		}
		app.error = error;
		page.redirect('/error');
	},
	getFormatedTime: function(d) {
		var w = Math.floor(d / 604800);
		var days = Math.floor(d / 86400) % 7;
		var h = Math.floor(d / 3600) % 24;
		var m = Math.floor(d / 60 % 60);
		var s = Math.floor(d % 60);
		var time = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
		if (days === 0 && w === 0){
			return time;
		}
		time = ' and ' + time;
		time = days > 0 ? days + ' days ' + time : time;
		time = w > 0 ? days > 0 ? w + ' weeks, ' + time : w + ' weeks ' + time : time;
		return time;
	},
	padTime: function(i) {
		var str = String(i);
		return '00'.substring(0, 2 - str.length) + str;
	},
	formatDate: function(date, omitTime) {
		if (!(date instanceof Date)) {
			date = new Date(date * 1000);
		}

		var result = date.toISOString();
		result = result.substring(0, result.indexOf('T'));

		if (omitTime) {
			return result + ' UTC';
		}

		return result + ' ' + util.padTime(date.getUTCHours()) + ':' + util.padTime(date.getUTCMinutes()) + ' UTC';
	},
	languages: [
		'java',
		'py',
		'c',
		'js'
	]
};
