var settings = {};

/* Validate settings */
function loadSettings() {
  // Check if chrome storage is supported
  if (!chrome.storage.sync) {
    alert("Chrome storage is not accessible :(");
  }

  chrome.storage.sync.get(function(keys) {
    console.log(keys);
    // openSetupScreen if any keys are empty
    if (isEmpty(keys)) {
      console.log('Welcome! Opening first time setup..');
      openSetupScreen();
    } else {
      settings = keys;

      draw();
    }
  });
}

function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}


/* Update settings */
function updateSettings() {
  // Form data
  var form = document.forms['settings'];
  var name = form['name'].value;
  var location = form['location'].value;
  var theme = form['theme'].value;
  var bg = form['bgtype'].value;
  var bgval = 'default';

  // Widget specific
  var widget_topsites = form['widget_topsites'].value;


  function validate() {
    // Fallback
    if (location == '') {
      location = "New York"
    } else {
      location = form['location'].value;
    }

    chrome.storage.sync.set(
      // Overwrite all keys
      {
        "name": name,
        "location": location,
        "theme": theme,
        "background": {
          "type": bg,
          "value": bgval
        },
        "widget_topsites": widget_topsites
      },
      function() {
        alert('Changes saved successfully.');
      }
    );
  }

  // Validate input
  if (name == '' || theme == '') {
    alert('One or more fields have been left blank.');
  } else if (bg == 'image' || bg == 'color') {
    bgval = form['bgvalue'].value;
    if (bgval == '') {
      alert('You left a required background setting empty.')
    } else {
      bg = form['bgtype'].value;
      bgval = form['bgvalue'].value;
      validate();
    }
  } else {
    validate();
  }
}


/* Search */
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

/* BG type */
function queryBgType() {
  var container = document.getElementById("bgsettings");
  var form = document.forms['settings'];
  var type = form['bgtype'].value;
  var image_html = `
   <input id="bgvalue" name="bgvalue" placeholder="http://google.com/images/this.jpg" class="u-full-width" type="text"/>
   <b class="hint">Please enter a valid image URL for a background cover.</b>`;

  var color_html = `
   <input id="bgvalue" name="bgvalue" placeholder="#000 / black / rgba(0,0,0,0)" class="u-full-width" type="text"/>
   <b class="hint">Please enter a valid HEX, RGBA, or English color value.</b>`;

  if (type == 'image') {
    container.innerHTML = image_html;
    form['bgvalue'].value = settings.background.value;
  } else if (type == 'color') {
    container.innerHTML = color_html;
    form['bgvalue'].value = settings.background.value;
  } else {
    container.innerHTML = '';
  }
}


/* Register */
function registerWidgets() {
  setBackground();

  topSitesWidget();

  clockWidget();

}


/* Settings Screen */
function openSettingsScreen() {
  var form = document.forms['settings'];

  // Get settings
  form['name'].value = settings.name;
  form['location'].value = settings.location;
  form['theme'].value = settings.theme;
  form['widget_topsites'].value = settings.widget_topsites;
  form['bgtype'].value = settings.background.type;

  queryBgType();

  // Remove fadeout if exists, display modal
  document.getElementById("settingsModal").classList.remove("fadeOutLoad");
  document.getElementById("settingsModal").style.display = "initial";
}

function closeSettingsScreen() {
  // Gracefull exit
  document.getElementById("settingsModal").classList.add("fadeOutLoad");
  setTimeout(function() {
    document.getElementById("settingsModal").style.display = "none";
  }, 950);
}


/* Draw */
function draw() {
  // Make buttons
  document.getElementById('submit_button').addEventListener('click', function() { updateSettings(); });
  document.getElementById('cancel_button').addEventListener('click', function() { closeSettingsScreen(); });
  document.getElementById('bgtype').addEventListener('click', function() { queryBgType(); });

  // Listen for settings Modal click
  document.getElementById("settings").addEventListener('click', function() {
    openSettingsScreen();
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

/* Init */
function init(settings) {
  console.log("==> init();");

  // Load settings
  settings();
}


window.onload = init(loadSettings);
