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
	observers: [
		'responseLoaded(response)'
	],
	responseLoaded: function(){
		this.data = this.response;
	}
};

Behaviors.Providers.General = [
	Behaviors.Requests.Base,
	Behaviors.Requests.Handler,
	NewBehavior
];
