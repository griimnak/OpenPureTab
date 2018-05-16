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

  Screen Trigger

  @req
  'append' -  Append initial form data and entrance
  'update' -  Update existing form data
  'exit'   -  Exit setting screen and load main.html

*/
function screenTrigger(req = '') {
  function structure() {
    // Get settings
    var form = document.forms['settings'];
    form['name'].value = settings.name;
    form['location'].value = settings.location;
    form['theme'].value = settings.theme;
    form['widget_topsites'].value = settings.widget_topsites;
    form['bgtype'].value = settings.background.type;
    form['widget_clock'].value = settings.widget_clock;

    // Sub-option queries
    queryBgType();
    queryClock();
  }

  if (req == 'append') {
    structure();

    // Remove fadeout if exists, gracefull entry
    document.getElementById("settingsModal").classList.remove("fadeOutLoad");
    document.getElementById("settingsModal").style.display = "initial";
  } else if (req == 'update') {
    // Update settings
    loadSettings();

    // Update form inputs
    structure();
  } else if (req == 'exit') {
    // Gracefull exit
    document.getElementById("settingsModal").classList.add("fadeOutLoad");
    setTimeout(function() {
      window.location.href="main.html";
    }, 350);
  }
}


/*

  Grab form data and validate update request

*/
function updateSettings() {
  // Grab form data
  var form = document.forms['settings'];
  var name = form['name'].value;
  var location = form['location'].value;
  var theme = form['theme'].value;
  var bg = form['bgtype'].value;
  var bgval = 'default';
  var ctext_value = '';
  var ctext_check = false;

  // Widget specific
  var widget_clock = form['widget_clock'].value;
  var widget_topsites = form['widget_topsites'].value;

  // Submit function
  function submit() {
    // Optional fallback
    if (location == '') {
      location = "New York"
    } else {
      location = form['location'].value;
    }

    // Set custom text if clock is disabled and input is not empty
    if(widget_clock == 'disabled' && form['clockvalue'].value !== '') {
      ctext_check = true;
      ctext_value = form['clockvalue'].value;
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
        "widget_clock": widget_clock,
        "widget_ctext": {
          "enabled": ctext_check,
          "value": ctext_value
        },
        "widget_topsites": widget_topsites
      },
      function() {
        flash('Changes saved successfully.');
        screenTrigger('update');
      }
    );
  }

  // Validate input
  if (name == '' || theme == '') {
    flash('One or more required fields have been left blank.');
  } else if (bg == 'image' || bg == 'color') {
    bgval = form['bgvalue'].value;
    if (bgval == '') {
      flash('You left a required background setting empty.');
    } else {
      bg = form['bgtype'].value;
      bgval = form['bgvalue'].value;
      submit();
    }
  } else {
    submit();
  }
}


/*

  Sub-option queries

*/
function queryBgType() {
  // Grab current form data
  var container = document.getElementById("bgsettings");
  var form = document.forms['settings'];
  var type = form['bgtype'].value;

  // HTML to append
  var image_html = `
   <input id="bgvalue" name="bgvalue" placeholder="http://google.com/images/this.jpg" class="u-full-width" type="text"/>
   <b class="hint">Please enter a valid image URL for a background cover.</b>`;
  var color_html = `
   <input id="bgvalue" name="bgvalue" placeholder="#000 / black / rgba(0,0,0,0)" class="u-full-width" type="text"/>
   <b class="hint">Please enter a valid HEX, RGBA, or English color value.</b>`;

  // If bgtype option == value with optional inputs, append optional input
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

function queryClock() {
  // Grab current form data
  var container = document.getElementById("clocksettings");
  var form = document.forms['settings'];
  var option = form['widget_clock'].value;

  // HTML to append
  var image_html = `
   <input id="clockvalue" name="clockvalue" placeholder="(Optional) display custom text" class="u-full-width" type="text"/>
   <b class="hint">The text above will be displayed where the clock is displayed.</b>`;

  // If clock == disabled, append optional custom text input
  if (option == 'disabled') {
    container.innerHTML = image_html;
    form['clockvalue'].value = settings.widget_ctext.value;
  } else {
    container.innerHTML = '';
  }
}


/*

  Initialize

*/
function draw() {
  // Make buttons
  document.getElementById('submit_button').addEventListener('click', function(event) { event.preventDefault(); updateSettings(); });
  document.getElementById('cancel_button').addEventListener('click', function() { screenTrigger('exit'); });
  document.getElementById('bgtype').addEventListener('click', function() { queryBgType(); });
  document.getElementById('widget_clock').addEventListener('click', function() { queryClock(); });

  screenTrigger('append');
}

// ==> init();
function init(settings) {
  console.log("==> init(options.js);");

  // Load settings
  settings();
}


window.onload = init(loadSettings);
