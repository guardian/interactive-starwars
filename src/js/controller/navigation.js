import scrollAnimate from '../lib/scrollAnimate';

var pageEl = document.body; 

export default function(el) {
    // scroll sections
    var nav = el.querySelector(".js-nav");    
    nav.addEventListener("click", e => {
        var state = e.target.dataset.nav;
        if (state === undefined) return;

        scrollAnimate(
            pageEl.scrollTop,
            el.querySelector(".js-" + state).offsetTop,
            250
        );
    });

    var topList = el.querySelectorAll(".js-top"),
        topArr = Array.prototype.slice.call(topList);
    topArr.forEach(top => {
        top.addEventListener("click", e => {
            scrollAnimate(
                pageEl.scrollTop,
                0,
                250
            );
        });
    });

    // swipe sections
    /*var mainEl = document.querySelector(".js-main");
      var mc = new Hammer(mainEl);
      mc.on("swipe pan", e => {
      console.log("switch section");
      });
      mc.on("tap", e => {
      console.log("tap");
      });*/
}
