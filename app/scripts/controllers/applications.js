'use strict';

(function(c){
  c.controller('Applications', function($scope, chromeMessaging) {

    var initialApps = function() {
        var currentApps = this.cloudApps;
        var regexApplications;

        var cloudApps = Array.prototype.slice.apply(arguments);
        var alreadyContained = false;
        
        for(var j = 0, ken = cloudApps.length; j < ken; j++) {
            for(var i = 0, len = currentApps.length; i < len; i++) {
                regexApplications = new RegExp(currentApps[i].url);
                if(regexApplications.exec(cloudApps[j].url)) {
                    alreadyContained = true;
                    break;
                }
            }
            if(!alreadyContained) {
                this.cloudApps.push(cloudApps[j]);
            }
            alreadyContained = false;
        }
    };

    var updateApp = function(cloudApp) {
        var currentApps = this.cloudApps;
        var regexApplications, alreadyContained;
        
        for(var i = 0, len = currentApps.length; i < len; i++) {
            regexApplications = new RegExp(currentApps[i].url);
                if(regexApplications.exec(cloudApp.url)) {
                    alreadyContained = true;
                    break;
                }
            }
        if(!alreadyContained) {
            this.cloudApps.push(cloudApp);
        }
        
        if(this.timerIsRunning) {
            clearTimeout(this.timeout);
        }
        this.start(i);
    };

    var formatNumber = function(n) {
        return (n).toString().length === 1 ? '0'+n : n;
    };

    var increase = function() {
        var second = +this.second;
        var minute = +this.minute;
        var hour = +this.hour;
        this.second = formatNumber(++second % 60);
        this.minute = formatNumber((parseInt(second / 60, 10) + minute) % 60 );
        this.hour = formatNumber((parseInt( (parseInt(second / 60, 10) + minute) / 60, 10 ) + hour) % 24 );
    };

    

    var clearApps = function() {
        this.cloudApps = [];
    };


    $scope.timerIsRunning = false;
    $scope.timeout = null;
    $scope.cloudApps = [];

    $scope.pause = function() {
        clearTimeout($scope.timeout);
        $scope.timerIsRunning = false;
    };

    $scope.clear = function() {
        $scope.pause();
        chromeMessaging.sendMessage({DELETE: 'applications'}, $scope, clearApps);
    };

    $scope.save = function() {
        chromeMessaging.sendMessage({PUT: 'applications', applications: $scope.cloudApps}, $scope, function(){});
    };

    $scope.start = function(index) {
        var cloudApp = $scope.cloudApps[index];
        $scope.timerIsRunning = true;

        $scope.timeout = setTimeout(function() {
            $scope.$apply(function() {
                increase.call(cloudApp);
                $scope.start(index);
            });
        }, 1000);
        
    };

    $scope.$on('applications', function() {
        switch(chromeMessaging.message) {
            case 'clear':
            $scope.clear();
            break;
            case 'save':
            $scope.save();
            break;
            case 'pause':
            $scope.pause();
            break;
        }
    });

    chromeMessaging.onMessage($scope, updateApp);
    chromeMessaging.sendMessage({GET: 'applications'}, $scope, initialApps);

});
})(window.CloudApp);
