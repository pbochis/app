var Behaviors = Behaviors || {};

Behaviors.ChallengeBehavior = {
	properties: {
		taskIndex: {
			type: Number,
			notify: true,
			value: 0
		},
		challenge: {
			type: Object,
			notify: true,
			reflectToAttribute: true
		},
		result: {
			type: Object,
			notify: true,
			reflectToAttribute: true
		},
		task: {
			type: Object,
			notify: true,
			observer: '_taskChanged'
		},
		challengeStartTime: {
			type: Number,
			value: 0
		},
		taskStartTime: {
			type: Number,
			value: 0
		}
	},
	observers: [
		'afterPropertiesSet(challenge, result)'
	],
	afterPropertiesSet: function() {
		if(this.result.startTimes){
			for(var i=0; i<this.challenge.tasks.length; i++){
				if(new Date(this.result.startTimes[i]).getTime()>0){
					this.taskIndex = i;
				}
			}
		}
		this.challengeStartTime = new Date(this.result.startTimes[0]).getTime();
		this.taskStartTime = new Date(this.result.startTimes[this.taskIndex]).getTime();
		this.startChallenge();
	},
	startTask: function(){
		var task = this.challenge.tasks[this.taskIndex];
		this.$.taskService.startTask(this.result.id, task);
		this.$.taskService.getById(task);
	},
	// TODO abstract task listeners
	_taskChanged: function(){
		if(!this.task){
			return;
		}
		this.importHref('/elements/coder/challenge/tasks/' + this.task.endpoint.component + '.html', function(){
			var webInterface = document.createElement(this.task.endpoint.component);
			webInterface.task = this.task;

			var element = this;
			webInterface.addEventListener('task-finished', function(){
				var msg = 'Are you sure you want to finish this task? You will not able to come back again and change it.';
				if (!window.confirm(msg)) {
					return;
				}
				// element.$.taskService.finishTask();
				element._nextTask();
			});

			this._replaceContent(webInterface);
		});
    this.elementTaskChanged();
	},
	_nextTask: function(){
		this.taskStartTime = 0;

		this.taskIndex++;
		if(this.taskIndex < this.challenge.tasks.length){
			this.startTask();
			return;
		}
		this.$.coolNav.stop();
		// This starts the result computing
		this.$.getResultRequest.url = util.build('/results/' + this.result.id);
		this.$.getResultRequest.generateRequest();

		this._importAndReplaceContent('/elements/coder/challenge/info/challenge-finished.html', 'challenge-finished');

		app.finishChallenge();
	},
	_replaceContent: function(element){
		this.contentStyle = '';
		this.$.content.innerHTML = '';
		this.$.content.appendChild(element);
	},
	_importAndReplaceContent: function(importPath, elementName){
		this.importHref(importPath, function(){
			this._replaceContent(document.createElement(elementName));
		});
	}
};
