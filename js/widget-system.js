function draggable(ob) {
  var object = ob,
  initX, initY, firstX, firstY;

  object.addEventListener('mousedown', function(e) {

    e.preventDefault();
    this.initX = this.offsetLeft;
    this.initY = this.offsetTop;
    this.firstX = e.pageX;
    this.firstY = e.pageY;

    this.addEventListener('mousemove', dragIt, false);

    window.addEventListener('mouseup', function() {
      object.removeEventListener('mousemove', dragIt, false);
    }, false);

  }, false);

  object.addEventListener('touchstart', function(e) {

    e.preventDefault();
    this.initX = this.offsetLeft;
    this.initY = this.offsetTop;
    var touch = e.touches;
    this.firstX = touch[0].pageX;
    this.firstY = touch[0].pageY;

    this.addEventListener('touchmove', swipeIt, false);

    window.addEventListener('touchend', function(e) {
      e.preventDefault();
      object.removeEventListener('touchmove', swipeIt, false);
    }, false);

  }, false);
}

function dragIt(e) {
  this.style.left = this.initX+e.pageX-this.firstX + 'px';
  this.style.top = this.initY+e.pageY-this.firstY + 'px';
}

function swipeIt(e) {
  var contact = e.touches;
  this.style.left = this.initX+contact[0].pageX-this.firstX + 'px';
  this.style.top = this.initY+contact[0].pageY-this.firstY + 'px';
}

function updateClick() {
    var a = document.getElementsByClassName("widget");
    for(var i=0;i<a.length;i++){
        draggable(a[i]);
    }
}

updateClick();
