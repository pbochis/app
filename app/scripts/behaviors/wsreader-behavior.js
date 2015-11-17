var Behaviors = Behaviors || {};

Behaviors.WSReaderBehavior = {
	listeners: {
		'ws-onerror': '_onWsError',
		'ws-onmessage': '_onWsMessage',
		'ws-onopen': '_onWsOpen'
	},
	_onWsOpen: function(){
		// default action
		console.log('WS OPENED');
	},
	_onWsError: function(err){
		//default action
		console.log(err);
	},
	_onWsMessage: function(data){
		// implement me
		console.log('Implement _onWsMessage to display ' + data.toString());
	}
};