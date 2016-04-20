var Behaviors = Behaviors || {};

Behaviors.FileExplorerItemBehavior = {
	properties: {
		meta: {
			type: Object,
			notify: true,
			reflectToAttribute: true,
			observer: '_metaSet'
		},
		editMode: {
			type: Boolean,
			notify: true,
			value: false
		},
		newName: {
			type: String,
			notify: true
		}
	},
	listeners: {
		'contextmenu': '_contextmenu'
	},
	_metaSet: function(){
		if (!this.meta){
			return;
		}
		this.$.wrapper.style.marginLeft = this.meta.order * 20 + 'px';
	},
	_contextmenu: function(e){
		e.preventDefault();
		this.fire('show-menu', {
			'element': this,
			'x': e.pageX,
			'y': e.pageY
		});
	},
	rename: function(){
		this.newName = this.meta.name;
		this.editMode = true;
	},
	_confirmRename: function(e){
		if (e.keyCode === 13){
			if (!this.newName || this.newName.length === 0){
				this.$.toast.text = this.meta.isFolder ? 'Folder name cannot be empty' : 'File name cannot be empty';
				this.$.toast.show();
				return;
			}
			if (this.newName === 'root' && this.meta.isFolder){
				this.$.toast.text = 'Folder cannot be named root';
				this.$.toast.show();
				return;
			}
			if (this.newName !== this.meta.parent.findFirstAvailableName(this.newName, this.meta.isFolder)){
				this.$.toast.text = this.meta.isFolder ? 'A folder with the same name exists' : 'A file with the same name exists';
				this.$.toast.show();
				return;
			}
			this.set('meta.name', this.newName);
			this.editMode = false;
		}
		else if (e.keyCode === 27){
			this.editMode = false;
		}
	},
	delete: function(){
		if (this.meta.name === 'root' && this.meta.isFolder){
			return;
		}
		this.meta.parent.deleteChild(this.meta);
	}
};
