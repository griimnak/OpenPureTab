function updateClock() {
  var datetimeNow = new Date();
  var nhour = datetimeNow.getHours();
  var nmin = datetimeNow.getMinutes();
  var nsec = datetimeNow.getSeconds(),ap;

  if(nhour==0) {
    ap=" AM";
    nhour=12;
  } else if(nhour<12) {
    ap=" AM";

  } else if(nhour==12) {
    ap=" PM";

  } else if(nhour>12) {
    ap=" PM";
    nhour-=12;
  }
  if(nmin<=9) nmin="0"+nmin;
  if(nsec<=9) nsec="0"+nsec;

  document.getElementById('clocktext').innerHTML=""+nhour+":"+nmin+":"+nsec+ap+"";
}

function tick(){
  updateClock();
  setInterval(updateClock,1000);
}

function clockWidget() {
  if (settings.widget_ctext.enabled == true && settings.widget_ctext.value != '') {
    document.getElementById('clocktext').innerHTML= settings.widget_ctext.value;
  }

  if (settings.widget_clock == 'enabled_style1') {
    tick();
  } else if (settings.widget_clock == 'disabled_doodle') {
    getGoogleDoodle();
  }

  return true;
}

function getGoogleDoodle() {
  var request = new XMLHttpRequest();

  // bind a function to handle request status
  request.onreadystatechange = function() {
      if(request.readyState < 4) {
          // handle preload
          return;
      }
      if(request.status !== 200) {
          // handle error
          return;
      }
      if(request.readyState === 4) {
          // handle successful request
          successCallback();
      }
  };

  // open the request to the specified source
  request.open('GET', "https://www.google.com", true);
  // execute the request
  request.send('');

  successCallback = function() {
    var parser = new DOMParser();
    var parsed = parser.parseFromString(request.responseText, "text/html");
    try {
      var content = parsed.getElementById("hplogo").getElementsByTagName('img')[0].src;
      var clean = content.replace(window.location.origin, "https://google.com");
    } catch(error) {
      console.log(error);
    }

    var doodle_html = `
      <img src="${clean}" style="margin-top:-40px;"/>
    `
    document.getElementById('clocktext').innerHTML= doodle_html;
  };
}
