var Notifications = {

  getNotifications: function() {
    var that = this;

    return new Promise(function(resolve, reject) {
      that.getClient().then(function(client) {
        var user = client.getUser();

        user.notifications(function(err, notifications) {
          if(err !== null) {
            reject(err);
          } else {
            resolve(notifications);
          }
        });
      }, reject);
    });
  },

  getClient: function() {
    var that = this;

    return new Promise(function(resolve, reject) {
      chrome.storage.sync.get('options', function(data) {
        var token = data.options.githubToken;

        if (typeof(token) === 'undefined') {
          reject();
        } else {
          var client = new Github({
            token: token,
            auth: "oauth"
          });
          resolve(client);
        }
      });
    });
  }
}
