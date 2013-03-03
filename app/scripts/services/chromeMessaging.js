'use strict';
(function(c, chrome){
  c.service('chromeMessaging', function($rootScope) {
    this.onMessage = function(scope, callback) {
      chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
        if(sender && sender.tab && sender.tab.id === -1) {// We only take requests from the Background Page
          console.log("ON ACTIVATED");
          scope.$apply(function() {
            callback.call(scope, request);  
          })
        }
      })
    };
    this.sendMessage = function(request, scope, callback) {
      chrome.extension.sendMessage(undefined, request, function(response) {
        console.log("ON UPDATED");
        scope.$apply(function() {
          callback.apply(scope, response)
        });
      });
    }
    this.broadcast = function(controller, message) {
      this.message = message;
      $rootScope.$broadcast(controller);
    }
  });
})(window.CloudApp, window.chrome);