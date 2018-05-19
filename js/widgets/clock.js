function ClockWidget() {

  this.tick = function() {
    var datetimeNow = new Date();
    var nhour = datetimeNow.getHours();
    var nmin = datetimeNow.getMinutes();
    var nsec = datetimeNow.getSeconds(),ap;

    // Copy pasta
    if(nhour==0) { ap=" AM"; nhour=12; } else
    if(nhour<12) { ap=" AM"; } else if(nhour==12) { ap=" PM";
    } else if(nhour>12) { ap=" PM"; nhour-=12; }
    if(nmin<=9) nmin="0"+nmin;
    if(nsec<=9) nsec="0"+nsec;

    document.getElementById('clocktext').innerHTML=""+nhour+":"+nmin+":"+nsec+ap+"";
  }

  this.getClock = function() {
    this.tick();
    setInterval(this.tick,1000);
  }


  this.getDoodle = function() {
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
            self.successCallback();
        }
    };

    // open the request to the specified source
    request.open('GET', "https://www.google.com", true);
    // execute the request
    request.send('');

    self.successCallback = function() {
      var parser = new DOMParser();
      var parsed = parser.parseFromString(request.responseText, "text/html");
      try {
        var content = parsed.getElementById("lga").getElementsByTagName('img')[0].src;
        var clean = content.replace(window.location.origin, "https://www.google.com");
      } catch(error) {
        console.log(error);
      }

      var doodle_html = `
        <a href="https://google.com">
          <img src="${clean}" style="margin-top:-40px;max-width:272px;max-height:201px;"/>
        </a>
      `
      document.getElementById('clocktext').innerHTML= doodle_html;
    };
  }


}
