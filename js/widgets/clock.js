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
  }

  return true;
}
