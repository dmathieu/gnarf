(function() {
  "use strict";
  var notifications = [];

  var updateCount = function() {
    var count = notifications.length;
    var text = '';

    if (count > 9999) {
      text = '∞';
    } else if (count > 0) {
      text = count.toString();
    }

    chrome.browserAction.setBadgeText({
      text: text
    });
  }

  var updateNotifications = function() {
    Notifications.getNotifications().then(function(n) {
      notifications = n;
      updateCount();
    }, function(error) {
      console.error(error);
    });
  }

  var goToNextNotification = function(tab) {
    if (notifications.length == 0) {
      return;
    }

    var notification = notifications[0];
    var origin = notification['subject']['url'].split('/');
    var type   = notification['subject']['type'];
    var id     = origin[origin.length - 1];

    var url;
    if (type === 'Commit') {
      url = notification['repository']['html_url'] + '/commit/' + id;
    } else {
      url = notification['repository']['html_url'] + '/issues/' + id;
    }

    if (tab !== undefined && (tab.url === '' || tab.url === 'chrome://newtab/' || tab.url.match(/github\.com/))) {
      chrome.tabs.update(null, {url: url});
    } else {
      chrome.tabs.create({url: url});
    }
    notifications.shift();
    updateCount();
  }

  chrome.browserAction.setBadgeBackgroundColor({
    color: [65, 131, 196, 255]
  });

  chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      goToNextNotification(tabs[0]);
    });
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    gotoNextNotification(tab);
  });

  updateNotifications();
  chrome.alarms.create({periodInMinutes: 1});
  chrome.alarms.onAlarm.addListener(updateNotifications);
}());
