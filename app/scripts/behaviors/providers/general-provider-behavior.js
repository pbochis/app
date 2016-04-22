var Behaviors = Behaviors || {};
Behaviors.Providers = Behaviors.Providers || {};

Behaviors.Providers.General = {
	properties: {
		baseUrl: {
			type: String,
			value: util.baseUrl()
		},
		data: {
			type: Object,
			reflectToAttribute: true,
			notify: true
		}
	}
};
