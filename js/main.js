var settings = {};
/*  Load settings
*/
function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function loadSettings() {
  // Check if chrome storage is supported
  if (!chrome.storage.sync) {
    alert("Chrome storage is not accessible :(");
  }

  chrome.storage.local.get(function(local_keys) {
    // console.log(local_keys);
  });
  chrome.storage.sync.get(function(keys) {
    // console.log(keys);

    // Trigger first time setup if keys are empty
    if (isEmpty(keys)) {
      // console.log('Welcome! Opening first time setup..');
      openSetupScreen();
    } else {
      settings = keys;
      draw();
    }
  });
}


/*  Get form data and validate inputs
*/
function finalizeSetup() {
  // Grab form data
  var form = document.forms['setup'];
  var name = form['name'].value;
  var location = form['location'].value;
  var theme = form['theme'].value;

  if (name == '' || theme == '') {
    flash('One or more required fields have been left blank.');
  } else {
    // Optional fallback
    if (location == '') {
      location = "New York"
    } else {
      location = form['location'].value;
    }

    var keys =
    // Set default keys
    {
      "name": name,
      "location": location,
      "theme": theme,
      "background":{"type":"default","value":"default"},
      "widget_clock":"enabled_style1",
      "widget_ctext": {
        "enabled": "false",
        "value": ""
      },
      "widget_topsites": "enabled_default"
    };

    var local_keys =
    {
      "thumbs" : [
        {"url": "http://otp.test.com", "image": "img/rain.gif"}
      ]
    };
    chrome.storage.local.set(local_keys);

    chrome.storage.sync.set(keys, function() {
      flash('Welcome to OpenPureTab, '+name+'.');
      setTimeout(function(){window.location.href = 'new-tab.html';}, 2500);
    });

  }
}

/*  Draw first time setup
*/
function openSetupScreen() {
  document.body.innerHTML = html;

  var submit_button = document.getElementById('submit_button');
  submit_button.addEventListener('click', function(event) {
    event.preventDefault();
    finalizeSetup();
  });
}

var html = `
<div class="modal">
  <div id="flashes"></div>
  <div class="setupBox">
    <h4>First time setup</h4>
    <p>Before we begin, let's get some basic information.</p>
    <form name="setup">
      <div class="row">
        <div class="two columns">Name</div>
        <div class="ten columns">
          <input name="name" placeholder="How shall I address you by?" class="u-full-width" type="text"/>
        </div>
      </div>
      <div class="row">
        <div class="two columns">Location</div>
        <div class="ten columns">
          <input name="location" placeholder="Leave emtpy if don't plan on using the weather widget." class="u-full-width" type="text"/>
        </div>
      </div>
      <div class="row">
        <div class="two columns">Theme</div>
        <div class="ten columns">
        <select class="u-full-width" id="theme">
          <option value="default">Light (default)</option>
          <option value="dark">Dark</option>
        </select>
        </div>
      </div>
      <div class="row">
        <button id="submit_button" class="u-pull-right button-primary">Setup</button>
      </div>
    </form>
  </div>
</div>
`;

/*  Global message flashing
*/
function flash(message) {
  // Set flash message
  chrome.storage.local.set({"flashed_msg":message}, function() {
    chrome.storage.local.get({"flashed_msg":message}, function(data) {
      if (!isEmpty(data.flashed_msg)) {
        // console.log('==> flash();');
        var html = `<div class="flash fadeInLoad">${data.flashed_msg}</div>`;
        document.getElementById("flashes").innerHTML = html;

        chrome.storage.local.set({"flashed_msg":""});
      }
    });
  });
}
