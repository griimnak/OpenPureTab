var content = document.getElementById("topsites");
var data = {};

function topSitesWidget() {
  chrome.topSites.get(function(response) {
    data = response;

    if (settings.widget_topsites == "enabled_default") {
      drawChromeStyle();
    } else if (settings.widget_topsites == "enabled_style1_top") {
      drawStyle1Top();
    } else if (settings.widget_topsites == "enabled_style1_bottom") {
      drawStyle1Bottom();
    } else if (settings.widget_topsites == "enabled_ball") {
      drawBallStyle();
    }
  });
}

function drawChromeStyle() {
  function appendChromeStyle(title, url, inner) {
    var html = `
      <a href="${url}" class="tile">
      ${title}
      </a>
    `;

    document.getElementById("topsites-chrome").innerHTML += html;
  }

  var inner = `
    <div class="topsites-chrome">
      <div id="topsites-chrome" style="margin:0 auto;display: inline-table;padding-left:5px;">

      </div>
    </div>
  `;

  content.innerHTML += inner;
  for(var i=0;i<8;i++) {
    console.log(data[i]);
    appendChromeStyle(data[i].title, data[i].url);
  }
}

function drawBallStyle() {
  function appendBallStyle(title, url, inner) {
    var sliced = title.substring(0, 1);

    var html = `
      <a href="${url}" class="tile">
      ${sliced}
      </a>
    `;

    document.getElementById("topsites-ball").innerHTML += html;
  }

  var inner = `
    <div class="topsites-ball">
      <div id="topsites-ball" style="margin:0 auto;display: inline-table;padding-left:5px;">

      </div>
    </div>
  `;

  content.innerHTML += inner;
  for(var i=0;i<8;i++) {
    console.log(data[i]);
    appendBallStyle(data[i].title, data[i].url);
  }
}


function drawStyle1Top() {
  function appendStyle1Top(title, url, inner) {
    var html = `
      <a href="${url}" class="tile">
      &bull; ${title} &bull;
      </a>
    `;

    document.getElementById("topsites-style1-top").innerHTML += html;
  }

  var inner = `
    <div class="topsites-style1-top">
      <div class="inner" id="topsites-style1-top">

      </div>
    </div>
  `;

  document.getElementById("settings").style.color = "#efefef";
  content.innerHTML += inner;
  for(var i=0;i<8;i++) {
    console.log(data[i]);
    appendStyle1Top(data[i].title, data[i].url);
  }
}


function drawStyle1Bottom() {
  function appendStyle1Bottom(title, url, inner) {
    var html = `
      <a href="${url}" class="tile">
      &bull; ${title} &bull;
      </a>
    `;

    document.getElementById("topsites-style1-bottom").innerHTML += html;
  }

  var inner = `
    <div class="topsites-style1-bottom">
      <div class="inner" id="topsites-style1-bottom">

      </div>
    </div>
  `;

  content.innerHTML += inner;
  for(var i=0;i<8;i++) {
    console.log(data[i]);
    appendStyle1Bottom(data[i].title, data[i].url);
  }
}

