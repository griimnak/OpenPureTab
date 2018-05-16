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
  function appendChromeStyle(title, url, thumb) {
    var html = `
      <a href="${url}" class="tile fadeInLoad">
        <img class="thumbnail" src="${thumb}"/>
        <div class="title">
          <img src="https://www.google.com/s2/favicons?domain=${url}" />
          <b class="title-text">${title}</b>
        </div>
      </a>
    `;

    document.getElementById("topsites-chrome").innerHTML += html;
  }

  var inner = `
    <div class="topsites-chrome">
      <div id="topsites-chrome">

      </div>
    </div>
  `;

  content.innerHTML += inner;

  chrome.storage.local.get(null, function(allkeys) {
      var er = chrome.runtime.lastError;
      var thumbss = allkeys.thumbs;

      if (er) {
        alert(JSON.stringify(er));
      }


      for(var i=0;i<8;i++) {
        var thumb = '';
        for(var t=0;t<thumbss.length;t++) {
          if (data[i].url === thumbss[t].url) {
            thumb = thumbss[t].image;
          }

        }



      appendChromeStyle(data[i].title, data[i].url, thumb);
    }
  });

}

function drawBallStyle() {
  function appendBallStyle(title, url, inner) {
    var html = `
      <a href="${url}" class="tile">
        <img src="https://www.google.com/s2/favicons?domain=${url}" />
      </a>
    `;

    document.getElementById("topsites-ball").innerHTML += html;
  }

  var inner = `
    <div class="topsites-ball">
      <div id="topsites-ball" style="margin:0 auto;padding-left:5px;">

      </div>
    </div>
  `;

  content.innerHTML += inner;


  for(var i=0;i<data.length;i++) {
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
    appendStyle1Bottom(data[i].title, data[i].url);
  }
}

