(function() {
  "use strict";

  function loadOptions() {
    chrome.storage.sync.get('options', function(data) {
      var token = (data.options || {}).githubToken || '';
      document.querySelector('[data-settings=github-token]').
        value = token;
    });
  }

  function storeOptions() {
    var token = document.querySelector('[data-settings=github-token]').value;

    chrome.storage.sync.set({
      options: { githubToken: token }
    }, function optionsSaved() {
      console.log("saved!");
      window.close();
    });
  }

  function cancel() {
    window.close()
  }

  document.addEventListener('DOMContentLoaded', loadOptions);
  document.querySelector('#buttonSave').addEventListener('click', storeOptions);
  document.querySelector('#buttonCancel').addEventListener('click', cancel);

}());
