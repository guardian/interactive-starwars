import scrollAnimate from '../lib/scrollAnimate';

var pageEl = document.body; 

export function loadNavigation(data) {
    var navEls;
    
    navEls = d3.select(".js-nav")
    .selectAll("li")
    .data(data).enter()
    .append("li")
    .attr("data-nav", d => d.id)
    .attr("class", d => "btn-nav");
    
    navEls
    .append("span")
    .html('<svg class="svg-nav" viewBox="0 0 30 30"><path d="M15.4,23.5l7.6-7.6l-0.7-0.7l-6.6,5.5v-14h-1.5v14l-6.6-5.5l-0.7,0.7l7.6,7.6H15.4" /></svg>');
    navEls
    .append("span")
    .text(d => d.type);
}

export function addNavigationOnScroll(el) {
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
