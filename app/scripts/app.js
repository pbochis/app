/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.properties = {
    challenge: {
      type: Object,
      notify: true
    }
  };

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
    var challengeKey = localStorage.getItem("challenge");
    if(challengeKey!="" && challengeKey!= undefined){
      app.requestData(challengeKey)
    }
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.requestData = function(challengeKey){
    if(challengeKey!="" && challengeKey!= undefined){
      localStorage.setItem("challenge", challengeKey);
      post(app.$.resultRequest, "/results", {'ChallengeKey': challengeKey})
    }
  }

  app.onChallengeResponse = function(r){
    var challenge = r.detail.response;
    app.challenge = challenge;
  }

  app.onResultResponse = function(r){
    var result = r.detail.response
    localStorage.setItem("result", result.Key);
    app.result = result
    get(app.$.challengeRequest, "/challenges/" + localStorage.getItem("challenge"))
  }

  app.isCompany = function(){
    return localStorage.getItem("role") == "COMPANY";
  }

  app.isCoder = function(){
    return localStorage.getItem("role") == "CODER";
  }

  app.isLoggedIn = function(){
    return localStorage.getItem("token") != "" && localStorage.getItem("token") != undefined;
  }

})(document);
