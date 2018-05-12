function finalizeSetup() {
  var form = document.forms['setup'];

  var name = form['name'].value;
  var location = form['location'].value;
  var theme = form['theme'].value;

  if (name == '' || theme == '') {
    alert('One or more fields have been left blank.');
  } else {
    if (location == '') {
      location = "New York"
    } else {
      location = form['location'].value;
    }

    var keys =
    {
      "name": name,
      "location": location,
      "theme": theme,
      "background":{"type":"default","value":"default"},
      "widget_topsites": "disabled"
    };

    chrome.storage.sync.set(keys, function() {
      alert('Welcome, '+name+'.');
    });

  }
}

function openSetupScreen() {
  document.body.innerHTML = html;

  var createButton = document.getElementById('submit_button');
  createButton.addEventListener('click', function() { finalizeSetup(); });
}

var html = `
<div class="modal">
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
