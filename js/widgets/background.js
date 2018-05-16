function setBackground() {
  if (settings.background.type == 'image') {
    document.body.style.background = 'url(' + settings.background.value + ')  no-repeat';
    document.body.style.backgroundSize = '100% 100%';
    document.body.style.color = "#ffffff";
    document.getElementById("settings").style.color = "#ffffff";
    document.getElementById('overlay').innerHTML += '<div class="fullscreenOverlay"></div>';

  } else if (settings.background.type == 'color') {
    document.body.style.backgroundColor = settings.background.value;
  }
}
