var Behaviors = Behaviors || {};
Behaviors.Providers = Behaviors.Providers || {};

var NewBehavior = {
	properties: {
		data: {
			type: Object,
			notify: true,
			reflectToAttribute: true
		}
	},
	listeners: {
		'request-finished': '_requestFinished'
	},
	_requestFinished: function(e, d){
		this.data = d;
	}
};

Behaviors.Providers.General = [
	Behaviors.Requests.Base,
	Behaviors.Requests.Handler,
	NewBehavior
];
