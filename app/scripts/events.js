'use strict';
(function(c) {
	var storage = c.storage.sync;

	var sendToDashboard = function(message) {
		c.extension.sendMessage(undefined, message, function(response) {
			console.log(response);
		});
	};

	var getFromStorage = function(key, callback) {
		storage.get(key, function(objectData) {
			callback(objectData[key]);
		});
	};

	var deleteFromStorage = function(key, callback) {
		storage.remove(key, function() {
			callback();
		});
	};

	var updateToStorage = function(applicationsData) {
		storage.set(applicationsData, function(o) {
			console.log(o);
		});
	};

	var saveInStorage = function(tab) {
		storage.get('applications', function(applicationsData) {
			if(!applicationsData || !applicationsData.applications) {
				applicationsData = {applications: []};
			}
			var applicationsArray = applicationsData.applications;
			var regexApplications;
			for (var i = 0, len = applicationsArray.length; i < len; i++) {
				regexApplications = new RegExp(applicationsArray[i].url);
				if(regexApplications.exec(tab.url)) { return; }
			}

			applicationsArray.push(tab);
			storage.set(applicationsData, function(o) {
				console.log(o);
			});
		});
	};

	var saveAndsend = function(tab) {
		saveInStorage(tab);
		sendToDashboard(tab);
	};

	c.browserAction.onClicked.addListener(function() {
		var windowData = {
			url: ['chrome://newtab', 'http://google.com', 'http://c9.io'],
			focused: true,
			type: 'normal',
		};
		c.windows.create(windowData, function(w) {
			//c.windows.update(w.id,{state: 'fullscreen'}, function(){
				storage.set({windowId: w.id}, function(){
				console.log('Saved window ID');
			//});
			});
		});

	});

	c.tabs.onActivated.addListener(function(activeInfo) {
		storage.get('windowId', function(windowData) {
			if(windowData && windowData.windowId === activeInfo.windowId) {
				var tabId = activeInfo.tabId;
				c.tabs.get(tabId, function(tab) {
					if(tab.url !== 'chrome://newtab/' && tab.status === 'complete') {
						var tabInformation = {
							url: tab.url,
							name: tab.title,
							hour: '00',
							minute: '00',
							second: '00'
						};
						saveAndsend(tabInformation);
					}
				});
			}
		});
	});

	c.tabs.onCreated.addListener(function(tab) {
		storage.get('windowId', function(windowData) {
			if(tab.status === 'complete' &&
				windowData &&
				windowData.windowId === tab.windowId &&
				tab.url !== 'chrome://newtab/') {
				var tabInformation = {
					url: tab.url,
					name: tab.title,
					hour: '00',
					minute: '00',
					second: '00'
				};
				saveAndsend(tabInformation);
			}
		});
	});

	c.extension.onMessage.addListener(function(request, sender, sendResponse){
		if(request.GET) {
			switch(request.GET) {
				case 'applications':
					getFromStorage('applications', sendResponse);
					return true;
				case 'dates':
				break;
			}
		} else if(request.DELETE) {
			switch(request.DELETE) {
				case 'applications':
					deleteFromStorage('applications', sendResponse);
					return true;
				case 'dates':
				break;
			}
		} else if(request.PUT) {
			switch(request.PUT) {
				case 'applications':
					updateToStorage({applications: request.applications});
					return true;
				case 'dates':
				break;
			}
		}
    });

})(window.chrome);
