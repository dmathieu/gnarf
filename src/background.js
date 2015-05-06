(function() {
  "use strict";
  var notification;

  var updateNotificationsCount = function() {
    chrome.storage.sync.get('options', function(data) {
      var token = data.options.githubToken;
      var github = new Github({
        token: token,
        auth: "oauth"
      });
      var user = github.getUser();

      if (typeof(token) === 'undefined') {
        return
      }

      user.notifications(function(err, notifications) {
        var count = notifications.length;
        var text  = '';

        if (count > 9999) {
          text = '∞';
        } else if (count > 0) {
          text = count.toString();
        }

        if (count > 0) {
          notification = notifications[0];
        } else {
          notification = undefined;
        }

        chrome.browserAction.setBadgeText({
          text: text
        });
      });
    });
  }

  chrome.browserAction.setBadgeText({
    text: '∞'
  });

  chrome.browserAction.setBadgeBackgroundColor({
    color: [65, 131, 196, 255]
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    if (typeof(notification) == 'undefined') {
      return;
    }

    var origin = notification['subject']['url'].split('/');
    var type   = notification['subject']['type'];
    var id     = origin[origin.length - 1];

    var url;
    if (type === 'Commit') {
      url = notification['repository']['html_url'] + '/commit/' + id;
    } else {
      url = notification['repository']['html_url'] + '/issues/' + id;
    }

    if (tab.url === '' || tab.url === 'chrome://newtab/' || tab.url.match(/github\.com/)) {
      chrome.tabs.update(null, {url: url});
    } else {
      chrome.tabs.create({url: url});
    }

    setTimeout(updateNotificationsCount, 5000);
  });


  updateNotificationsCount();
  chrome.alarms.create({periodInMinutes: 1});
  chrome.alarms.onAlarm.addListener(updateNotificationsCount);
}());
