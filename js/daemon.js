/*

  Tab Query - Applies topSites thumbnails

  Compares current tab URL with data[z].url (Topsite urls)
  If data[z].url (Topsite urls) has an entry equal to active (current tab),
  Check for http vs https and match if found
  If active (current tab) exists in local storage, do nothing, otherwise
  take screenshot of matched tab and insert into local storage

*/
function queryTab(active, active_id) {
  var clean = active.replace(/^https:\/\//i, 'http://');
  for(var z = 0; z < data.length; z++) {
    if (data[z].url === active) {
      match(active, active_id);
    } else if (data[z].url === clean) {
      match(clean, active_id);
    }
  }

  function match(url, active_id) {
    chrome.storage.local.get(null, function(resp) {
      var toWork = resp.thumbs;

      var found = false;
      var i = 0;
      for (i in toWork) {
        if(toWork[i].url === url) {
          found = true;
        }
      }

      if (found == false) {
        found = true;
        captureAndSave();
      }
    });

    function captureAndSave() {
      chrome.storage.local.get(null, function(resp) {
        var parse_obj = resp;

        chrome.tabs.captureVisibleTab(function(dataUrl) {
          parse_obj['thumbs'].push({"url": url, "image": dataUrl});

          chrome.storage.local.set(parse_obj, function() {
            return true;
          });
        });
      });
    }
  }
}


/*

  Initialize OPT Daemon

*/
var data;
// Retreive topsites on extension load / browser restart
chrome.topSites.get(function(response) {
  data = response;
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status == "complete") {
    // Query tab when it is finished loading
    queryTab(tab.url, tabId);
  }
});
