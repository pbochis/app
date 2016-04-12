var Behaviors = Behaviors || {};

Behaviors.ChallengeBehavior = {
	properties: {
		taskIndex: {
			type: Number,
			notify: true,
			value: 0
		},
		challengeTemplate: {
			type: Object,
			notify: true
		},
		challengeId: {
			type: Number,
			notify: true
		},
		result: {
			type: Object,
			notify: true
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
		'afterPropertiesSet(challengeTemplate, result)'
	],
	afterPropertiesSet: function(){
		this.taskIndex = 0;
		if(!this.result.taskResults || this.result.taskResults.length === 0){
			this.startTask();
			this.startChallenge();
			return;
		}
		var taskResults = {};
		var i = 0;
		var hasEndTime = false;
		for(i=0; i<this.result.taskResults.length; i++){
			taskResults[this.result.taskResults[i].task.id] = this.result.taskResults[i];
		}
		for(i=0; i<this.challengeTemplate.tasks.length; i++){
			var taskResult = taskResults[this.challengeTemplate.tasks[i]];
			if(!taskResult){
				continue;
			}
			if(taskResult.task.id === this.challengeTemplate.tasks[i] && taskResult.startTime){
				this.taskIndex = i;
				hasEndTime = !!taskResult.endTime;
			}
		}
		if(this.challenge.startDate && this.challenge.endDate){
			this.challengeStartTime = new Date(this.challenge.startDate * 1000).getTime();
			this.challengeDuration = (new Date(this.challenge.endDate * 1000).getTime() - this.challengeStartTime) / 1000;
		}else{
			this.challengeDuration = -1;
		}

		this.taskStartTime = new Date(taskResults[this.challengeTemplate.tasks[this.taskIndex]].task.startTime).getTime();
		if(hasEndTime){
			this.taskIndex++;
			this.startTask();
			this.startChallenge();
			return;
		}
		this.getTask();
		this.startChallenge();
	},
	startTask: function(){
		var task = this.challengeTemplate.tasks[this.taskIndex];
		this.$.taskService.startTask(this.result.id, task);
	},
	getTask: function(){
		var task = this.challengeTemplate.tasks[this.taskIndex];
		this.$.taskService.getById(task);
	},
	onTaskStarted: function(){
		this.getTask();
	},
	// TODO abstract task listeners
	_taskChanged: function(){
		if(!this.task){
			return;
		}
		this.importHref('/elements/coder/challenge/tasks/' + this.task.endpoint.component + '.html', function(){
			var webInterface = document.createElement(this.task.endpoint.component);
			webInterface.task = this.task;
			webInterface.challengeId = this.challengeId;

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
			element.contentWrapperStyle = '';
			element.stopAppLoading();
		});
    this.elementTaskChanged();
	},
	_nextTask: function(){
		this.taskStartTime = 0;

		this.taskIndex++;
		if(this.taskIndex < this.challengeTemplate.tasks.length){
			this.startTask();
			return;
		}
		this.$.coolNav.stop();
		// This starts the result computing
		this.$.getResultRequest.url = util.build('/results/' + this.result.id);
		this.$.getResultRequest.generateRequest();

		this._challengeEnded();
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
	},
	_challengeEnded: function(){
		var self = this;
		this.importHref('/elements/coder/challenge/info/challenge-ended.html', function(){
			var webInterface = document.createElement('challenge-ended');
			webInterface.challengeId = self.challengeId;
			self._replaceContent(webInterface);
		});
	}
};
