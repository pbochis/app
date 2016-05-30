var Behaviors = Behaviors || {};
Behaviors.Providers = Behaviors.Providers || {};

Behaviors.Providers.General = {
	properties: {
		baseUrl: {
			type: String
		},
		data: {
			type: Object,
			reflectToAttribute: true,
			notify: true
		},
		error: {
			type: Object,
			reflectToAttribute: true,
			notify: true
		}
	},
	listeners: {
		'response': 'onResponse',
		'error': 'onError'
	},
	ready: function(){
		var prefix = 'https://platform.cod.uno';

		if (location.origin.indexOf('localhost') !== -1) {
			prefix = 'http://localhost:8080';
		}

		if (location.origin.indexOf('coduno-lab') !== -1) {
			prefix = 'https://platform-dot-coduno-lab.appspot.com';
		}

		this.baseUrl = prefix;
	},
	onResponse: function(r){
		this.error = null;
		this.data = r.detail.response;
	},
	onError: function(e){
		this.error = {
			'status': e.detail.request.xhr.status,
			'error': e.detail.request.xhr.response
		};
		if (this.error.status === 500 || this.error.status === 404 || this.error.status === 403){
			util.error(this.error);
			return;
		}
		if (this.error.status === 401){
			page('/login');
		}
		// Other statuses most likely indicate validation errors or bad inputs
		// so we proxy them so each component can handle them accordingly.
	}
};
