/* Query search
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



/* Register Widgets
*/
function registerWidgets() {
   var widgets = {
    BackgroundWidget: function() {
      BackgroundWidget();
    },

    TopsitesWidget: function() {
      var tsw = new TopsitesWidget();
      switch(settings.widget_topsites) {
        case 'enabled_default': tsw.drawChromeStyle(); break;
        case 'enabled_ball': tsw.drawBallStyle(); break;
        case 'enabled_tiny': tsw.drawBallStyle('tiny'); break;
        case 'enabled_style1_top': tsw.drawStyle1Top(); break;
        case 'enabled_style1_bottom': tsw.drawStyle1Bottom(); break;
      }
    },

    ClockWidget: function() {
      if (settings.widget_ctext.enabled == true
        && settings.widget_ctext.value != '') {
        var container = document.getElementById('clocktext');
        container.innerHTML = settings.widget_ctext.value;
      }

      var cw = new ClockWidget();
      switch(settings.widget_clock) {
        case 'enabled_style1': cw.getClock(); break;
        case 'disabled_doodle': cw.getDoodle(); break;
      }
    },

  };

  function dispatch() {
    var load;
    for(var widget in widgets) {
      load = widgets[widget];
      load();
    }
  }
  // Dispatch all widgets
  dispatch();
}


/* Initialize
*/
function draw() {
  // Register Widgets
  registerWidgets();

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
}

// ==> init();
function init(settings) {
  // console.log("==> init(main.js);");

  // Load settings
  settings();
}


window.onload = init(loadSettings);
