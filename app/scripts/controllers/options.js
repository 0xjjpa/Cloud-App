'use strict';

(function(c){
  c.controller('Options', function($scope, chromeMessaging) {
    $scope.clear = function() {
        chromeMessaging.broadcast('applications', 'clear');
    };

    $scope.save = function() {
        chromeMessaging.broadcast('applications', 'save');
    };

    $scope.pause = function() {
        chromeMessaging.broadcast('applications', 'pause');
    };

});
})(window.CloudApp);
