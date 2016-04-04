var Behaviors = Behaviors || {};

Behaviors.DateTimeBehavior = {
	_formatDate: function (date) {
		if(!date){
			return '';
		}
		return util.formatDate(date);
	}
};
