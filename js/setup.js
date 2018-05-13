/*

  Get form data and validate inputs

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
      "widget_topsites": "enabled_ball"
    };

    chrome.storage.sync.set(keys, function() {
      flash('Welcome to OpenPureTab, '+name+'.');
      setTimeout(function(){window.location.href = 'main.html';}, 2500);
    });

  }
}


/*

  Draw first time setup

*/
function openSetupScreen() {
  document.body.innerHTML = html;

  var createButton = document.getElementById('submit_button');
  createButton.addEventListener('click', function(event) { event.preventDefault(); finalizeSetup(); });
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


/*

  Global message flashing

*/
function flash(message) {
  if (!chrome.storage.local) {
    alert("Local storage is not accessible :(");
  }
  // Set flash message
  chrome.storage.local.set({"flashed_msg":message}, function() {
    chrome.storage.local.get({"flashed_msg":message}, function(data) {
      if (!isEmpty(data.flashed_msg)) {
        console.log('==> flash();');
        var html = `<div class="show" id="snackbar">${data.flashed_msg}</div>`;
        document.getElementById("flashes").innerHTML = html;
      }
    });
  });

  // Remove html and clear local storage after 3 seconds
  function remove() {
    console.log('==> remove();')
    chrome.storage.local.clear(function() {
      var error = chrome.runtime.lastError;
      if (error) { console.error(error) }
      var msgbox = document.getElementById("snackbar");
      msgbox.classList.remove("show");
    });
  }

  setTimeout(function(){ remove() }, 3000);

  function isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}
