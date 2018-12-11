function isEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}


function flash(message) {
  chrome.storage.local.set({"flashed_msg":message}, function() {
    chrome.storage.local.get({"flashed_msg":message}, function(data) {
      if (!isEmpty(data.flashed_msg)) {
        console.log('==> flash();');
        var html = `<div class="flash fadeInLoad">${data.flashed_msg}</div>`;
        document.getElementById("flashes").innerHTML = html;

        chrome.storage.local.set({"flashed_msg":""});
      }
    });
  });
}
