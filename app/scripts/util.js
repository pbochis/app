var BASE_URL = 'https://api.cod.uno';

if (location.origin.indexOf('localhost') !== -1) {
	BASE_URL = 'http://localhost:8080';
}

var accessToken = undefined;
if (localStorage.accessToken !== undefined) {
	accessToken = JSON.parse(localStorage.accessToken);
}

var company = undefined;
if (localStorage.company !== undefined) {
	company = JSON.parse(localStorage.company);
}

var user = undefined;
if (localStorage.user !== undefined) {
	user = JSON.parse(localStorage.user);
}

function get(ajaxRequest, route, authorization, responseCallback) {
	ajaxRequest.url = BASE_URL + route;
	ajaxRequest.method = 'GET';
	if (authorization) {
		ajaxRequest.headers = { 'Authorization': authorization };
	} else {
		ajaxRequest.headers = { 'Authorization': 'Token ' + accessToken.Value };
	}
	ajaxRequest.generateRequest();
}

function post(ajaxRequest, route, body) {
	ajaxRequest.url = BASE_URL + route;
	ajaxRequest.method = 'POST';
	ajaxRequest.headers = { 'Authorization': 'Token ' + accessToken.Value };
	ajaxRequest.body = JSON.stringify(body);
	ajaxRequest.generateRequest();
}

function getLanguagesForTags(tags) {
	var langs = [];
	for(var i = 0; i < tags.length; i++) {
		langs.push(getLanguageForTag(tags[i]));
	}
	return langs;
}

function getLanguageForTag(tag) {
	var lang = { tag: tag }
	switch (tag) {
		case 'c':
			lang.name = 'C';
			break;
		case 'cpp':
			lang.name = 'C++';
			break;
		case 'java':
			lang.name = 'Java';
			break;
		case 'py':
			lang.name = 'Python';
			break;
		default:
			lang.name = 'Undefined';
			break;
	}
	return lang;
}

function put(ajaxRequest, route, body) {
	ajaxRequest.url = BASE_URL + route;
	ajaxRequest.method = 'PUT';
	ajaxRequest.headers = { 'Authorization': 'Token ' + accessToken};
	ajaxRequest.body = JSON.stringify(body);
	ajaxRequest.generateRequest();
}

(function(){
	var initialError;

	function handleError(error) {
		initialError = error;
		if (error.detail.request.xhr.status == 401) {
			return page.redirect('/login');
		}
		page.redirect('/error');
	}

	function getLastError() {
		return initialError;
	}

	window.getLastError = getLastError;
	window.handleError = handleError;
})();
