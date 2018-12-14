function TopsitesWidget() { }

var content = document.getElementById("topsites");
var data = {};
chrome.topSites.get(function(response) {
    data = response;
});

TopsitesWidget.prototype.draw_vanilla = function() {
    // Vanilla topsite style
    // This is the style currently used in chrome 69+
    // Appends the container to :param content:
    // Then appends tiles to :param tile_container:
    console.log("TopsitesWidget() -> draw_vanilla()")
    var html = `
    <!-- Vanilla Topsites -->
    <div class="vanilla_topsite_container">
      <div id="vanilla_tiles" class="topsite_tiles">

      </div>
    </div>
    `;
    content.innerHTML += html;

    function append_vanilla(title, url) {
        console.log("TopsitesWidget() -> append_vanilla()")
        var tile_container = document.getElementById("vanilla_tiles")
        var tile = `
            <a class="tile" href="${url}">
              <div class="edit_handle icon ion-android-more-vertical"></div>
              <div class="circle">
                <img class="favicon" src="chrome://favicon/size/24@1x/${url}" />
              </div>
              <div class="caption">${title}</div>
            </a>
        `;

        tile_container.innerHTML += tile;
    }

    for(var i=0;i<8;i++) {
        append_vanilla(data[i].title, data[i].url);
    }
};
