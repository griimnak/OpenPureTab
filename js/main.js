var settings = {};
/*

  Load settings

*/
function loadSettings() {
  function isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
  // Check if chrome storage is supported
  if (!chrome.storage.sync) {
    alert("Chrome storage is not accessible :(");
  }

  chrome.storage.local.get(function(keys) {
    console.log(keys);
  });
  chrome.storage.sync.get(function(keys) {
    console.log(keys);

    // Trigger first time setup if keys are empty
    if (isEmpty(keys)) {
      console.log('Welcome! Opening first time setup..');
      openSetupScreen();
    } else {
      settings = keys;
      draw();
    }
  });
}


/*

   Query search

*/
function querySearch(value) {
  var sliced = value.substring(0, 5);
  var www = value.substring(0, 4);

  // Goto url if str has http/https/www
  if (sliced == 'http:' || sliced == 'https') {
    /*window.open(value, "_self");*/
    window.location.href=value;
  } else if (www == 'www.') {
    try {
      window.location.href='http://'+value;
    } catch(ni) {
      window.location.href='https://'+value;
    }
  } else {
    // If not a url
    window.location.href="https://www.google.com/search?q="+value;
  }

  return false;
}



/*

  Register Widgets

*/
function registerWidgets() {

  setBackground();

  topSitesWidget();

  clockWidget();

}


/*

  Initialize

*/
function draw() {
  // Listen for settings Modal click
  document.getElementById("settings").addEventListener('click', function() {
    if (chrome.runtime.getURL) {
      window.location.href = chrome.runtime.getURL('settings.html');
    } else {
      window.location.href = "settings.html";
    }
  });

  // Submit on <ENTER>
  document.getElementById('search').onkeydown = function(e){
    if(e.keyCode == 13){
     querySearch(document.getElementById('search').value);
    }
  };

  // Register Widgets
  registerWidgets();
}

// ==> init();
function init(settings) {
  console.log("==> init(main.js);");

  // Load settings
  settings();
}


window.onload = init(loadSettings);
