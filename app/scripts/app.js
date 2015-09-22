(function(document) {
	'use strict';

	// Grab a reference to our auto-binding template
	// and give it some initial binding values
	// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
	var app = document.querySelector('#app');

	app.properties = {
		challenge: {
			type: Object,
			notify: true
		},
		isCompany: {
			type: Boolean,
			notify: true
		},
		isCoder: {
			type: Boolean,
			notify: true
		},
		isLoggedIn: {
			type: Boolean,
			notify: true
		},
		selected: {
			type: String,
			notify: true,
			value: '0'
		},
		ironPagesStyle: {
			type: String,
			notify: true
		},
		progressStyle: {
			notify: true,
			value: 'display: none;'
		}
	};

	app.showProgress = function(){
		app.progressStyle = '';
		app.ironPagesStyle = 'display: none;';
	};

	app.hideProgress = function(){
		app.progressStyle = 'display: none;';
		app.ironPagesStyle = '';
	};

	app.finishChallenge = function() {
		localStorage.removeItem('challenge');
		localStorage.removeItem('currentTask');
		localStorage.removeItem('currentTaskIndex');
		localStorage.removeItem('timer');
		localStorage.removeItem('result');
	};

	app.login = function() {
		app.refreshMenu();
		if (!localStorage.accessToken) {
			return page.redirect('/unauthorized');
		}
		if (localStorage.company) {
			return page.redirect('/candidates');
		}
		page.redirect('/challenge');
	};

	app.logout = function() {
		localStorage.clear();
		app.refreshMenu();
		page.redirect('/login');
	};

	app.refreshMenu = function() {
		app.isCompany = !!localStorage.company;
		app.isCoder = !app.isCompany;
		app.isLoggedIn = localStorage.accessToken;
	};

	app.displayInstalledToast = function() {
		console.log('Caching complete.');
	};

	// Listen for template bound event to know when bindings
	// have resolved and content has been stamped to the page
	app.addEventListener('dom-change', function() {
		app.refreshMenu();
		if(window.location.hash!==''){
			// TODO(victorbalan): Find a way to set the correct selected tab instead
			// of deselecting everything.
			app.selected='-1';
		}
	});

	// See https://github.com/Polymer/polymer/issues/1381
	window.addEventListener('WebComponentsReady', function() {
		// imports are loaded and elements have been registered
	});

	// Close drawer after menu item is selected if drawerPanel is narrow
	app.onMenuSelect = function() {
		var drawerPanel = document.querySelector('#paperDrawerPanel');
		if (drawerPanel.narrow) {
			drawerPanel.closeDrawer();
		}
	};

	app.startChallenge = function() {
		var challengeKey = localStorage.getItem('challenge');
		if (challengeKey !== '' && challengeKey !== null) {
			util.post(app.$.resultRequest, '/results', {'ChallengeKey': challengeKey});
		}
	};

	app.onChallengeResponse = function(r) {
		var challenge = r.detail.response;
		app.challenge = challenge;
	};

	app.onResultResponse = function(r) {
		var result = r.detail.response;
		localStorage.setItem('result', result.Key);
		app.result = result;
		util.get(app.$.challengeRequest, '/challenges/' + localStorage.getItem('challenge'));
	};

	app.createChallenge = function() {
		app.$.taskList.createChallenge();
	};

})(document);
