var settings = {};

function OpenPureTab() { OpenPureTab.prototype.__init__(); }

OpenPureTab.prototype.__init__ = function() {
    // Initialize OpenPureTab
    // :function load_settings():
    console.log("OpenPureTab() -> __init__()")
    OpenPureTab.prototype.load_settings();
};

OpenPureTab.prototype.load_settings = function() {
    // Load settings
    // :function trigger_setup_screen(): if keys isEmpty
    console.log("OpenPureTab() - > load_settings()");

    chrome.storage.local.get(function(local_keys) {
    // console.log(local_keys);
    });
    chrome.storage.sync.get(function(keys) {
        // console.log(keys);
        if (isEmpty(keys)) {
            console.log('OpenPureTab() -> trigger_setup_screen()');
            OpenPureTab.prototype.trigger_setup_screen();
        } else {
            settings = keys;
            OpenPureTab.prototype.dispatch_widgets();
        }
    });
}

OpenPureTab.prototype.dispatch_widgets = function() {
    // Widgets dispatcher function
    // Load Widgets syncronously as an object list. Define in :param widgets:
    // and :function dispatch(): all widgets
    console.log("OpenPureTab() -> dispatch_widgets()")
    var widgets = {
        TopsitesWidget: function() {
            var tsw = new TopsitesWidget();
            tsw.draw_vanilla();
/*            switch(settings.widget_topsites) {
                case 'enabled_default': return tsw.drawChromeStyle();
                case 'enabled_ball': return tsw.drawBallStyle();
                case 'enabled_tiny': return tsw.drawBallStyle('tiny');
                case 'enabled_style1_top': return tsw.drawStyle1Top();
                case 'enabled_style1_bottom': return tsw.drawStyle1Bottom();
            }*/
        }
    }

    function dispatch() {
        var load;
        for(var widget in widgets) {
            load = widgets[widget];
            load();
        }
  }
  // Dispatch all widgets
  dispatch();
};

OpenPureTab.prototype.trigger_setup_screen = function() {
    // Setup Screen trigger
    // Append :param setup_modal_html: to document.body,
    // Create event listener for submition click, then :function finalize_setup():
    var setup_modal_html = `
    <div id="setup_modal" class="modal">
      <div id="flashes"></div>
      <div class="setup_box fadeInLoad">
        <h4>First time setup</h4>
        <p>Welcome to OpenPureTab 1.5!</p>
        <p style="padding-bottom:10px;">Before we begin, let's get some basic information.</p>
        <form name="setup">
          <div class="row">
            <div class="title">Username</div>
            <input name="name" placeholder="How shall I address you by?" class="u-full-width" type="text"/>
          </div>
          <div class="row">
            <div class="title">Location</div>
            <input name="location" placeholder="Leave emtpy if don't plan on using the weather widget." class="u-full-width" type="text"/>
          </div>
          <div class="row">
            <div class="title">Theme</div>
            <select class="" id="theme">
              <option value="default">Light (default)</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div class="row">
            <button id="submit_button" class="u-pull-right button-primary">Setup</button>
          </div>
        </form>
      </div>
    </div>
    `;
    document.body.innerHTML += setup_modal_html;

    var submit_button = document.getElementById('submit_button');
    submit_button.addEventListener('click', function(event) {
        event.preventDefault();
        OpenPureTab.prototype.finalize_setup();
    });
}

OpenPureTab.prototype.finalize_setup = function() {
    // Setup submition
    // Sets formsdata :vars:, authenticates formdata
    // and injects default configuration keys upon finalization.
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
    {
        "name": name,
        "location": location,
        "theme": theme,
        "background":{"type":"video","value":"videos/test.mp4"},
        "widget_clock": {
            "enabled": "false",
            "style": ""
        },
        "widget_ctext": {
            "enabled": "false",
            "value": ""
        },
        "widget_topsites": {
            "enabled": "true",
            "style": "vanilla"
        }
    };

    var local_keys =
    {
        "thumbs" : [
            {"url": "http://localhost", "image": "img/rain.gif"}
        ]
    };
    chrome.storage.local.set(local_keys);

    chrome.storage.sync.set(keys, function() {
        flash('Welcome to OpenPureTab, '+name+'.');
        setTimeout(function(){window.location.href = 'new-tab.html';}, 2500)
    });

  }
}


window.onload = new OpenPureTab();
