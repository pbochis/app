/**
 * Created by Paul on 7/20/2015.
 */
Polymer({
  is: 'editor-console',
  properties:{
    editor: {
      type: Object,
      reflectToAttribute: true,
      notify: true
    }
  },
  observers: [
    'afterPropertiesSet(editor)'
  ],
  afterPropertiesSet: function(){
    this.setLanguage();
  },
  ready: function(){
    this.$.console.textarea.value = 'Console';
  },
  runCode: function(){
    this.$.ajaxRequest.method='POST';
    this.$.ajaxRequest.body = JSON.stringify({'codeBase': this.getCode(), 'language': this.getSelectedLanguage()});
    this.$.ajaxRequest.url='/api/run/start/simple';
    this.$.ajaxRequest.generateRequest();
    this.$.console.textarea.value = '...';
  },
  onResponse: function(request){
    if(request.detail.response!=undefined){
      var codeRun = request.detail.response;
      if(codeRun.run==undefined || codeRun.run==""){
        this.$.console.textarea.value = codeRun.err;
      }else{
        this.$.console.textarea.value = codeRun.run;
      }
    }
  },
  getCode: function(){
    return this.editor.getValue();
  },
  getSelectedLanguage: function(){
    return this.$.language.options[this.$.language.selectedIndex].value;
  },
  setLanguage: function(){
    console.log('Setting language to ' + this.getSelectedLanguage());
    switch(this.getSelectedLanguage()){
      case 'py':
        this.setMode('ace/mode/python');
        this.setDefaultCodeTemplate();
        break;
      case 'java':
        this.setMode('ace/mode/java');
        this.setDefaultCodeTemplate();
        break;
      case 'c':
        this.setMode('ace/mode/c_cpp');
        this.setDefaultCodeTemplate();
        break;
      case 'cpp':
        this.setMode('ace/mode/c_cpp');
        this.setDefaultCodeTemplate();
        break;
      case 'js':
        this.setMode('ace/mode/javascript');
        this.setDefaultCodeTemplate();
        break;
    }
  },
  setMode: function(mode){
    this.editor.getSession().setMode({
      path: mode,
      v: Date.now()
    });
  },
  setDefaultCodeTemplate: function(template){
    //the code template will always come from the server
      this.editor.setValue('printf(\'Hi\')');
  }
});
